import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The CPF of the user in the format XXX.XXX.XXX-XX',
    example: '123.321.733-38',
  })
  @IsString()
  @IsNotEmpty({ message: 'The CPF cannot be empty.' })
  @Length(11, 14, { message: 'The cpf must be between 11 and 14 character.' })
  cpf: string;

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
