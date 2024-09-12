import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({
    description: 'The account number from which the withdrawal will be made',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty({ message: 'Account number cannot be empty.' })
  accountNumber: string;

  @ApiProperty({
    description: 'The amount to be withdrawn. Must be greater than one.',
    example: 50.0,
  })
  @IsNumber({}, { message: 'Amount must be a number.' })
  @Min(1, { message: 'Withdrawal amount must be greater than one.' })
  amount: number;
}
