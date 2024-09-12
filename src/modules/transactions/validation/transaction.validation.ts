import { IsString, IsNotEmpty, IsNumber, Min, Length } from 'class-validator';

export class DepositDtoValidation {
  @IsString()
  @IsNotEmpty({ message: 'Account number cannot be empty.' })
  accountNumber: string;

  @IsNumber({}, { message: 'Balance must be a number.' })
  @Min(0.01, { message: 'Deposit amount must be greater than zero.' })
  balance: number;
}

export class WithdrawDtoValidation {
  @IsString()
  @IsNotEmpty({ message: 'Account number cannot be empty.' })
  accountNumber: string;

  @IsNumber({}, { message: 'Amount must be a number.' })
  @Min(1, { message: 'Withdrawal amount must be greater than one.' })
  amount: number;
}

export class TransferDtoValidation {
  @IsString()
  @IsNotEmpty({ message: 'Source account number cannot be empty.' })
  fromAccountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Destination account number cannot be empty.' })
  toAccountNumber: string;

  @IsNumber({}, { message: 'Balance must be a number.' })
  @Min(0.01, { message: 'Transfer amount must be greater than zero.' })
  balance: number;
}

export class CheckBalanceValidation {
  @IsString()
  @IsNotEmpty({ message: 'Account number cannot be empty.' })
  accountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @Length(6, 6, {
    message: 'Password must 6 characters long.',
  })
  password: string;
}
