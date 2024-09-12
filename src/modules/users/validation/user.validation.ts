import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsDateString,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDtoValidation {
  @IsString()
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @Length(3, 50, { message: 'The name must be between 3 and 50 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'The CPF cannot be empty.' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'CPF must be in the format XXX.XXX.XXX-XX.',
  })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @Length(6, 6, { message: 'The password must be exactly 6 characters long.' })
  @Matches(/^\d+$/, {
    message: 'Password must contain only numbers.',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'The phone number cannot be empty.' })
  @IsPhoneNumber('BR', {
    message: 'The telephone number must be a valid number in Brazilian format.',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Date of birth cannot be empty.' })
  @IsDateString(
    {},
    { message: 'The date of birth must be in ISO format (YYYY-MM-DD).' },
  )
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty({ message: 'Account type cannot be empty.' })
  accountType: string;
}

export class UpdateUserDtoValidation {
  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR', {
    message: 'The telephone number must be a valid number in Brazilian format.',
  })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'Old password must be exactly 6 characters long.' })
  @Matches(/^\d+$/, {
    message: 'Old password must contain only numbers.',
  })
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'New password must be exactly 6 characters long.' })
  @Matches(/^\d+$/, {
    message: 'New password must contain only numbers.',
  })
  newPassword?: string;
}
