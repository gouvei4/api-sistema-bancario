import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with CPF and password' })
  @ApiBody({
    description: 'Login credentials',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'string',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginDto) {
    const { cpf, password } = body;
    return this.authService.login(cpf, password);
  }
}
