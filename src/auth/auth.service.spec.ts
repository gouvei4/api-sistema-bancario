import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: DatabaseService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    jwtService = module.get<JwtService>(JwtService);

    (bcrypt.compare as jest.Mock) = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar o usuário se as credenciais estiverem corretas', async () => {
      const mockUser = {
        id: 1,
        cpf: '12345678900',
        password: 'hashedPassword',
      };

      (databaseService.user.findUnique as jest.Mock).mockResolvedValue(
        mockUser,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('12345678900', 'password123');

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { cpf: '12345678900' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('deve lançar UnauthorizedException se as credenciais forem inválidas', async () => {
      (databaseService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.validateUser('12345678900', 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { cpf: '12345678900' },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
      const mockUser = {
        id: 1,
        cpf: '12345678900',
        password: 'hashedPassword',
      };

      (databaseService.user.findUnique as jest.Mock).mockResolvedValue(
        mockUser,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('12345678900', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        mockUser.password,
      );
    });
  });

  describe('login', () => {
    it('deve retornar um access token se o login for bem-sucedido', async () => {
      const mockUser = {
        id: 1,
        cpf: '12345678900',
        password: 'hashedPassword',
      };

      const mockToken = 'mocked_token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await service.login('12345678900', 'password123');

      expect(service.validateUser).toHaveBeenCalledWith(
        '12345678900',
        'password123',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.cpf,
        sub: mockUser.id,
      });
      expect(result).toEqual({ access_token: mockToken });
    });

    it('deve lançar UnauthorizedException se o login falhar', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        service.login('12345678900', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(service.validateUser).toHaveBeenCalledWith(
        '12345678900',
        'wrongPassword',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
