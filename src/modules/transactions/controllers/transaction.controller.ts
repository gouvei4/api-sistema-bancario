import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from '../service/transaction.service';
import { CheckBalanceDto } from '../dto/check-balance.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Retrieve all accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of all accounts retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllAcounts() {
    return this.transactionService.getAllAccounts();
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deposit funds into an account' })
  @ApiBody({
    description: 'Deposit request data',
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string', example: '' },
        balance: { type: 'number', example: 1000 },
        password: { type: 'string', example: '' },
      },
      required: ['accountNumber', 'balance'],
    },
  })
  @ApiResponse({ status: 200, description: 'Deposit successful.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async deposit(
    @Body('accountNumber') accountNumber: string,
    @Body('balance') balance: number,
    @Body('password') password: string,
  ) {
    return this.transactionService.deposit(accountNumber, balance, password);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Withdraw funds from an account' })
  @ApiBody({
    description: 'Withdraw request data',
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string', example: '' },
        balance: { type: 'number', example: 500 },
        password: { type: 'string', example: '' },
      },
      required: ['accountNumber', 'balance'],
    },
  })
  @ApiResponse({ status: 200, description: 'Withdrawal successful.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async withdraw(
    @Body('accountNumber') accountNumber: string,
    @Body('balance') balance: number,
    @Body('password') password: string,
  ) {
    return this.transactionService.withdraw(accountNumber, balance, password);
  }

  @ApiOperation({ summary: 'Transfer funds between accounts' })
  @ApiBody({
    description: 'Transfer request data',
    schema: {
      type: 'object',
      properties: {
        fromAccountNumber: { type: 'string', example: '' },
        toAccountNumber: { type: 'string', example: '' },
        amount: { type: 'number', example: 100 },
        password: { type: 'string', example: '' },
      },
      required: ['fromAccountNumber', 'toAccountNumber', 'amount'],
    },
  })
  @ApiResponse({ status: 200, description: 'Transfer successful.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiResponse({
    status: 404,
    description: 'Source or destination account not found.',
  })
  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async transfer(
    @Body()
    transferDto: {
      fromAccountNumber: string;
      toAccountNumber: string;
      amount: number;
      password: string;
    },
  ) {
    const { fromAccountNumber, toAccountNumber, amount, password } =
      transferDto;

    if (
      !fromAccountNumber ||
      !toAccountNumber ||
      amount === undefined ||
      !password
    ) {
      throw new BadRequestException(
        'fromAccountNumber, toAccountNumber, amount, and password are required',
      );
    }

    return this.transactionService.transfer(
      fromAccountNumber,
      toAccountNumber,
      amount,
      password,
    );
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Check the balance of an account' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async checkBalance(@Query() balanceDto: CheckBalanceDto) {
    const { accountNumber, password } = balanceDto;
    if (!accountNumber || !password) {
      throw new BadRequestException('Account number and password are required');
    }

    return this.transactionService.checkBalance(accountNumber, password);
  }

  @Get(':accountNumber/transfers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getTransferDetails(@Param('accountNumber') accountNumber: string) {
    try {
      const transfers =
        await this.transactionService.getTransferDetails(accountNumber);
      return transfers;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('An unexpected error occurred.');
    }
  }

  @Get('last-transfer/:accountNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getLastTransfer(@Param('accountNumber') accountNumber: string) {
    return this.transactionService.getLastTransfer(accountNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Post('boleto')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Generate a boleto' })
  @ApiBody({
    description: 'Boleto generation request data',
    schema: {
      type: 'object',
      properties: {
        value: { type: 'number', example: 5000 },
      },
      required: ['value'],
    },
  })
  @ApiResponse({ status: 200, description: 'Boleto generated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, invalid input data.' })
  async generateBoleto(@Req() req, @Body() body: { value: number }) {
    const userId = req.user.id;
    const boleto = await this.transactionService.createBoleto(
      body.value,
      userId,
    );
    return boleto;
  }

  @Post(':documentNumber/pagar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async payBoleto(@Req() req, @Param('documentNumber') documentNumber: string) {
    const userId = req.user.id;
    const boleto = await this.transactionService.payBoleto(
      userId,
      documentNumber,
    );
    return boleto;
  }
}
