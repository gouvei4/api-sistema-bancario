import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The phone number of the user in Brazilian format',
    example: '+55 31 98765-3375',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR', {
    message: 'The telephone number must be a valid number in Brazilian format.',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The old password of the user, must be exactly 6 digits',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'Old password must be exactly 6 characters long.' })
  @Matches(/^\d+$/, {
    message: 'Old password must contain only numbers.',
  })
  oldPassword?: string;

  @ApiProperty({
    description: 'The new password of the user, must be exactly 6 digits',
    example: '654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'New password must be exactly 6 characters long.' })
  @Matches(/^\d+$/, {
    message: 'New password must contain only numbers.',
  })
  newPassword?: string;
}
