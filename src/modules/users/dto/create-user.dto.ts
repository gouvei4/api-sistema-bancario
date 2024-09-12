import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';
import { typeAccount } from 'src/modules/common/enums/account-types.enum';

export class CreateUserDto implements Omit<Prisma.UserCreateInput, 'Account'> {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Afonso Gouveia',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @Length(3, 50, { message: 'The name must be between 3 and 50 characters.' })
  name: string;

  @ApiProperty({
    description: 'The CPF of the user in the format XXX.XXX.XXX-XX',
    example: '123.321.733-38',
  })
  @IsString()
  @IsNotEmpty({ message: 'The CPF cannot be empty.' })
  @Length(11, 14, { message: 'The cpf must be between 11 and 14 character.' })
  cpf: string;

  @ApiProperty({
    description: 'The password of the user, must be exactly 6 digits',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @Length(6, 6, { message: 'The password must be exactly 6 characters long.' })
  @Matches(/^\d+$/, {
    message: 'Password must contain only numbers.',
  })
  password: string;

  @ApiProperty({
    description: 'The phone number of the user in Brazilian format',
    example: '+55 31 98765-3375',
  })
  @IsString()
  @IsNotEmpty({ message: 'The phone number cannot be empty.' })
  @IsPhoneNumber('BR', {
    message: 'The telephone number must be a valid number in Brazilian format.',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'The date of birth of the user in ISO format',
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Date of birth cannot be empty.' })
  @IsDateString(
    {},
    { message: 'The date of birth must be in ISO format (YYYY-MM-DD).' },
  )
  dateOfBirth: string;

  @ApiProperty({
    description: 'The account type of the user',
    example: 'checking',
  })
  @IsString()
  @IsNotEmpty({ message: 'Account type cannot be empty.' })
  accountType: typeAccount;
}
