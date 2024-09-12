import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { TransactionModule } from './modules/transactions/transaction.module';

@Module({
  imports: [DatabaseModule, UserModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
