import { v4 as uuidv4 } from 'uuid';
import { typeAccount } from '../../../common/enums/account-types.enum';
import { agencyNumber } from '../../../common/enums/agency-number.enum';

export class AccountGenerator {
  public static exec(accountType: typeAccount) {
    const accountNumber = `${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 10)}`;

    return {
      id: uuidv4(),
      accountNumber,
      agencyNumber: agencyNumber.Agency1,
      balance: 0.0,
      type: accountType,
    };
  }
}
