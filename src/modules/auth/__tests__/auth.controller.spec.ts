import { Test, TestingModule } from '@nestjs/testing';
import { User, Role } from '@prisma/client';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUserReturned: Omit<User, 'password'> = {
    id: 1,
    email: 'test@email.com',
    username: 'test',
    role: Role.user,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockService = {
    signIn: jest.fn().mockResolvedValue({ access_token: 'access_token' }),
    signUp: jest.fn().mockResolvedValue(mockUserReturned),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          useValue: mockService,
          provide: AuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should login user', async () => {
      const mockUserForSignIn: SignInDto = {
        email: 'test@email.com',
        password: 'passwordHashed',
      };

      const result = await controller.signIn(mockUserForSignIn);
      expect(result).toEqual({ access_token: 'access_token' });
      expect(service.signIn).toHaveBeenCalledWith(
        mockUserForSignIn.email,
        mockUserForSignIn.password,
      );
    });
  });

  describe('signUp', () => {
    it('should signup user', async () => {
      const mockUserForCreate: SignUpDto = {
        email: 'test@email.com',
        username: 'test',
        password: 'passwordHashed',
        role: Role.user,
      };

      const result = await controller.signUp(mockUserForCreate);
      expect(result).toEqual(mockUserReturned);
      expect(service.signUp).toHaveBeenCalledWith(mockUserForCreate);
    });
  });
});
