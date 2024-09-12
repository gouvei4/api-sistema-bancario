import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, TransactionModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
