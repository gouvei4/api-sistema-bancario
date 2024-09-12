import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { compare } from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionService {
  constructor(private readonly dataBaseService: DatabaseService) {}

  private formatCurrency(value: Decimal): string {
    return value.toNumber().toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  async getAllAccounts() {
    const accounts = await this.dataBaseService.account.findMany({
      select: {
        id: true,
        accountNumber: true,
        agencyNumber: true,
        balance: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalAccounts = await this.dataBaseService.account.count();

    return {
      totalAccounts,
      accounts: accounts.map((account) => ({
        ...account,
        balance: this.formatCurrency(account.balance),
      })),
    };
  }

  async deposit(accountNumber: string, balance: number, password: string) {
    if (balance <= 0) {
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    const updatedAccount = await this.dataBaseService.$transaction(
      async (prisma) => {
        const account = await prisma.account.findUnique({
          where: { accountNumber },
          include: { User: true },
        });

        if (!account || !account.User) {
          throw new NotFoundException('Account not found');
        }

        const isPasswordValid = await compare(password, account.User.password);
        if (!isPasswordValid) {
          throw new BadRequestException('Invalid password');
        }

        const newBalance = new Decimal(account.balance).plus(
          new Decimal(balance),
        );

        const updatedAccount = await prisma.account.update({
          where: { accountNumber },
          data: {
            balance: newBalance,
          },
        });

        return {
          message: `Amount deposited: ${this.formatCurrency(new Decimal(balance))}`,
          balance: this.formatCurrency(updatedAccount.balance),
          accountNumber: account.accountNumber,
          agencyNumber: account.agencyNumber,
          name: account.User.name,
        };
      },
    );

    return updatedAccount;
  }

  async withdraw(accountNumber: string, amount: number, password: string) {
    if (amount <= 0) {
      throw new BadRequestException(
        'Withdrawal amount must be greater than zero',
      );
    }

    const updatedAccount = await this.dataBaseService.$transaction(
      async (prisma) => {
        const account = await prisma.account.findUnique({
          where: { accountNumber },
          include: { User: true },
        });

        if (!account || !account.User) {
          throw new NotFoundException('Account not found');
        }

        const isPasswordValid = await compare(password, account.User.password);
        if (!isPasswordValid) {
          throw new BadRequestException('Invalid password');
        }

        if (new Decimal(account.balance).lessThan(new Decimal(amount))) {
          throw new BadRequestException('Insufficient funds');
        }

        const newBalance = new Decimal(account.balance).minus(
          new Decimal(amount),
        );

        const updatedAccount = await prisma.account.update({
          where: { accountNumber },
          data: {
            balance: newBalance,
          },
        });

        return {
          message: `Amount withdrawn: ${this.formatCurrency(new Decimal(amount))}`,
          balance: this.formatCurrency(updatedAccount.balance),
          accountNumber: account.accountNumber,
          agencyNumber: account.agencyNumber,
          name: account.User.name,
        };
      },
    );

    return updatedAccount;
  }

  async transfer(
    fromAccountNumber: string,
    toAccountNumber: string,
    balance: number,
    password: string,
  ) {
    if (balance <= 0) {
      throw new BadRequestException(
        'Transfer amount must be greater than zero',
      );
    }

    const result = await this.dataBaseService.$transaction(async (prisma) => {
      const fromAccount = await prisma.account.findUnique({
        where: { accountNumber: fromAccountNumber },
        include: { User: true },
      });

      const toAccount = await prisma.account.findUnique({
        where: { accountNumber: toAccountNumber },
      });

      if (!fromAccount || !fromAccount.User) {
        throw new NotFoundException('Source account not found');
      }

      if (!toAccount) {
        throw new NotFoundException('Destination account not found');
      }

      const isPasswordValid = await compare(
        password,
        fromAccount.User.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      if (new Decimal(fromAccount.balance).lessThan(new Decimal(balance))) {
        throw new BadRequestException('Insufficient funds');
      }

      const updatedFromAccount = await prisma.account.update({
        where: { accountNumber: fromAccountNumber },
        data: {
          balance: new Decimal(fromAccount.balance).minus(new Decimal(balance)),
        },
      });

      const updatedToAccount = await prisma.account.update({
        where: { accountNumber: toAccountNumber },
        data: {
          balance: new Decimal(toAccount.balance).plus(new Decimal(balance)),
        },
      });

      return {
        message: `Transfer of ${this.formatCurrency(
          new Decimal(balance),
        )} completed successfully`,
        fromAccount: {
          accountNumber: updatedFromAccount.accountNumber,
          balance: this.formatCurrency(updatedFromAccount.balance),
        },
        toAccount: {
          accountNumber: updatedToAccount.accountNumber,
          balance: this.formatCurrency(updatedToAccount.balance),
        },
      };
    });

    return result;
  }
  async checkBalance(accountNumber: string, password: string) {
    const account = await this.dataBaseService.account.findUnique({
      where: { accountNumber },
      include: { User: true },
    });

    if (!account || !account.User) {
      throw new NotFoundException('Account not found');
    }

    const isPasswordValid = await compare(password, account.User.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return {
      message: 'Balance retrieved successfully',
      balance: this.formatCurrency(account.balance),
      name: account.User.name,
    };
  }
}
