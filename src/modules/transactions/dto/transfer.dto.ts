import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({
    description:
      'The source account number from which the amount will be transferred',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty({ message: 'Source account number cannot be empty.' })
  fromAccountNumber: string;

  @ApiProperty({
    description:
      'The destination account number to which the amount will be transferred',
    example: '987654321',
  })
  @IsString()
  @IsNotEmpty({ message: 'Destination account number cannot be empty.' })
  toAccountNumber: string;

  @ApiProperty({
    description: 'The amount to be transferred. Must be greater than zero.',
    example: 75.0,
  })
  @IsNumber({}, { message: 'Balance must be a number.' })
  @Min(0.01, { message: 'Transfer amount must be greater than zero.' })
  balance: number;
}
