import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AccountGenerator } from '../utils/generators/account.generator';
import { cpfFormatter } from '../utils/formatters/cpf.formatter';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const users = await this.databaseService.user.findMany({});

    if (!users) {
      throw new NotFoundException('Users not found');
    }
    const totalUsers = await this.databaseService.account.count();

    return {
      totalUsers,
      users: users.map((users) => ({
        ...users,
      })),
    };
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.cpf = cpfFormatter.exec(createUserDto.cpf);

    await this.checkIfUserExists(createUserDto.cpf, createUserDto.phoneNumber);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.databaseService.user.create({
      data: {
        name: createUserDto.name,
        cpf: createUserDto.cpf,
        password: hashedPassword,
        phoneNumber: createUserDto.phoneNumber,
        dateOfBirth: createUserDto.dateOfBirth,
        Account: { create: AccountGenerator.exec(createUserDto.accountType) },
      },
      select: { id: true },
    });

    return newUser;
  }

  async updateUser(
    userId: string,
    updateData: { phone?: string; oldPassword?: string; newPassword?: string },
  ) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.phone) {
      user.phoneNumber = updateData.phone;
    }

    if (updateData.oldPassword && updateData.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        updateData.oldPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(updateData.newPassword, 10);
      user.password = hashedNewPassword;
    } else if (updateData.oldPassword || updateData.newPassword) {
      throw new BadRequestException(
        'Both old and new passwords must be provided',
      );
    }

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        phoneNumber: user.phoneNumber,
        password: user.password,
      },
    });

    return { message: 'User updated successfully' };
  }

  async deleteUser(userId: string) {
    try {
      await this.databaseService.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { Account: true },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        if (user.Account) {
          const balanceFormatted = user.Account.balance
            .toNumber()
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });

          if (user.Account.balance.toNumber() !== 0) {
            throw new BadRequestException(
              `Cannot delete user because the account balance is not zero (${balanceFormatted})`,
            );
          }

          await prisma.account.delete({
            where: { id: user.Account.id },
          });
        }

        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (existingUser) {
          await prisma.user.delete({
            where: { id: existingUser.id },
          });
        }
      });

      return { message: 'User and associated account deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error.message.includes('Record to delete does not exist')
      ) {
        throw new NotFoundException('User or associated records not found');
      }

      throw error;
    }
  }

  private async checkIfUserExists(cpf: string, phoneNumber: string) {
    const userExists = await this.databaseService.user.findFirst({
      where: {
        OR: [{ cpf }, { phoneNumber }],
      },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }
  }
}
