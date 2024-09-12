import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({
    description: 'The account number where the deposit will be made',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty({ message: 'Account number cannot be empty.' })
  accountNumber: string;

  @ApiProperty({
    description: 'The amount to be deposited. Must be greater than zero.',
    example: 100.0,
  })
  @IsNumber({}, { message: 'Balance must be a number.' })
  @Min(0.01, { message: 'Deposit amount must be greater than zero.' })
  balance: number;
}
