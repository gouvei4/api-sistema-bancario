import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAllAcounts() {
    return this.transactionService.getAllAccounts();
  }

  @Post('deposit')
  async deposit(
    @Body('accountNumber') accountNumber: string,
    @Body('balance') balance: number,
  ) {
    return this.transactionService.deposit(accountNumber, balance);
  }

  @Post('withdraw')
  async withdraw(
    @Body('accountNumber') accountNumber: string,
    @Body('balance') balance: number,
  ) {
    return this.transactionService.withdraw(accountNumber, balance);
  }

  @Post('transfer')
  async transfer(
    @Body()
    transferDto: {
      fromAccountNumber: string;
      toAccountNumber: string;
      amount: number;
    },
  ) {
    const { fromAccountNumber, toAccountNumber, amount } = transferDto;

    if (!fromAccountNumber || !toAccountNumber || amount === undefined) {
      throw new BadRequestException(
        'fromAccountNumber, toAccountNumber, and amount are required',
      );
    }

    return this.transactionService.transfer(
      fromAccountNumber,
      toAccountNumber,
      amount,
    );
  }

  @Post('balance')
  async checkBalance(
    @Body() balanceDto: { accountNumber: string; password: string },
  ) {
    const { accountNumber, password } = balanceDto;

    if (!accountNumber || !password) {
      throw new BadRequestException('Account number and password are required');
    }

    return this.transactionService.checkBalance(accountNumber, password);
  }
}
