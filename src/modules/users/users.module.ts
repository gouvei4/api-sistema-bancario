import { Module } from '@nestjs/common';
import { UserController } from './controllers/users.controller';
import { UserService } from './services/users.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
