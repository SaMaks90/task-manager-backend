import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    username: 'Test',
    password: 'hashedPassword',
    role: Role.admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return jwt token if credentials are valid', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn(mockUser.email, mockUser.password);

      expect(result).toEqual({ access_token: 'jwt_token' });
      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.signIn('test@test.com', mockUser.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.getUserByEmail.mockResolvedValue(null);

      await expect(
        service.signIn('invalid@email.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should hash password and call createUser', async () => {
      const signUpDto: SignUpDto = {
        email: 'new@test.com',
        username: 'newuser',
        password: 'plainPassword',
        role: Role.user,
      };

      const hashedPass = 'hashedPassword';
      (hash as jest.Mock).mockResolvedValue(hashedPass);

      mockUsersService.createUser.mockResolvedValue({
        ...mockUser,
        email: signUpDto.email,
        username: signUpDto.username,
        password: hashedPass,
      });

      const result = await service.signUp(signUpDto);

      expect(hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: signUpDto.email,
          username: signUpDto.username,
        }),
      );

      expect(result).toHaveProperty('email', signUpDto.email);
    });
  });
});
