import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
