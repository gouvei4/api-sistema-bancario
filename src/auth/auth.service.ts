import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(cpf: string, password: string): Promise<any> {
    const user = await this.databaseService.user.findUnique({ where: { cpf } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(cpf: string, password: string) {
    const user = await this.validateUser(cpf, password);

    const payload = { username: user.cpf, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
