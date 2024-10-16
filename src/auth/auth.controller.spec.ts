import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o serviço de login com CPF e senha corretos', async () => {
    const mockToken = { access_token: 'mocked_token' };
    (authService.login as jest.Mock).mockResolvedValue(mockToken);

    const loginDto: LoginDto = {
      cpf: '12345678900',
      password: 'password123',
    };

    const result = await controller.login(loginDto);

    expect(authService.login).toHaveBeenCalledWith(
      loginDto.cpf,
      loginDto.password,
    );
    expect(result).toEqual(mockToken);
  });

  it('deve lançar erro se o login falhar', async () => {
    (authService.login as jest.Mock).mockRejectedValue(
      new Error('Unauthorized'),
    );

    const loginDto: LoginDto = {
      cpf: '12345678900',
      password: 'wrongPassword',
    };

    await expect(controller.login(loginDto)).rejects.toThrow('Unauthorized');

    expect(authService.login).toHaveBeenCalledWith(
      loginDto.cpf,
      loginDto.password,
    );
  });
});
