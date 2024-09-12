import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CheckBalanceDto {
  @ApiProperty({
    description: 'The account number for which the balance is being checked',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty({ message: 'Account number cannot be empty.' })
  accountNumber: string;

  @ApiProperty({
    description:
      'The password associated with the account. Must be exactly 6 characters long.',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @Length(6, 6, {
    message: 'Password must be 6 characters long.',
  })
  password: string;
}
