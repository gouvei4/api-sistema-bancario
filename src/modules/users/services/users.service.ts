import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../../database/database.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AccountGenerator } from '../utils/generators/account.generator';
import { cpfFormatter } from '../utils/formatters/cpf.formatter';
import { Decimal } from '@prisma/client/runtime/library';
import { calculateAge } from '../utils/calculate';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  private formatCurrency(value: Decimal): string {
    return value.toNumber().toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

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

  async getByUser(userId: string) {
    const account = await this.databaseService.account.findFirst({
      where: {
        User: { id: userId },
      },
      select: {
        id: true,
        accountNumber: true,
        agencyNumber: true,
        balance: true,
        type: true,
        User: {
          select: {
            id: true,
            name: true,
            password: true,
            cpf: true,
            phoneNumber: true,
            dateOfBirth: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found for this user');
    }

    return {
      ...account,
      balance: this.formatCurrency(account.balance),
    };
  }

  async getAccountByUserId(userId: string) {
    const account = await this.databaseService.account.findFirst({
      where: {
        User: { id: userId },
      },
      select: {
        id: true,
        accountNumber: true,
        agencyNumber: true,
        balance: true,
        type: true,
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found for this user');
    }

    return {
      ...account,
      balance: this.formatCurrency(account.balance),
    };
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.cpf = cpfFormatter.exec(createUserDto.cpf);

    await this.checkIfUserExists(createUserDto.cpf, createUserDto.phoneNumber);

    const dateOfBirth = new Date(createUserDto.dateOfBirth);
    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      throw new HttpException(
        'You must be at least 18 years old to register.',
        HttpStatus.BAD_REQUEST,
      );
    }

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

  async updateUser(userId: string, updateData: UpdateUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedData: { phoneNumber?: string; password?: string } = {};

    if (updateData.phoneNumber) {
      updatedData.phoneNumber = updateData.phoneNumber;
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
      updatedData.password = hashedNewPassword;
    } else if (updateData.oldPassword || updateData.newPassword) {
      throw new BadRequestException(
        'Both old and new passwords must be provided',
      );
    }

    await this.databaseService.user.update({
      where: { id: userId },
      data: updatedData,
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
