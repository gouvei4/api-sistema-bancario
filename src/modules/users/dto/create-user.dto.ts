import { Prisma } from '@prisma/client';
import { typeAccount } from 'src/modules/common/enums/account-types.enum';

export class CreateUserDto implements Omit<Prisma.UserCreateInput, 'Account'> {
  name: string;
  cpf: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  accountType: typeAccount;
}
