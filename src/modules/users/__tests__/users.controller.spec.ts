import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    password: 'passwordHashed',
    username: 'test',
    role: Role.user,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const updateUserDto: UpdateUserDto = {
    email: 'newtest@gmail.com',
  };
  const mockUserAfterUpdate: Omit<User, 'password'> = {
    id: mockUser.id,
    email: updateUserDto.email || '',
    updatedAt: new Date(),
    createdAt: mockUser.createdAt,
    username: mockUser.username,
    role: mockUser.role,
  };

  const mockUserAfterUpdateRole: Omit<User, 'password'> = {
    id: mockUser.id,
    email: updateUserDto.email || '',
    updatedAt: new Date(),
    createdAt: mockUser.createdAt,
    username: mockUser.username,
    role: Role.admin,
  };

  const mockUsersService = {
    deleteUser: jest.fn().mockResolvedValue({
      username: mockUser.username,
      email: mockUser.email,
    }),
    updateUser: jest.fn().mockResolvedValue(mockUserAfterUpdate),
    updateUserRole: jest.fn().mockResolvedValue(mockUserAfterUpdateRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteUser', () => {
    it('should delete a user and return email and username', async () => {
      const result = await controller.deleteUser(1);
      expect(result).toEqual({
        email: mockUser.email,
        username: mockUser.username,
      });
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    it('should update user and return user data without password', async () => {
      const result = await controller.updateUser(1, updateUserDto);
      expect(result).toEqual(mockUserAfterUpdate);
      expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role and return user data without password', async () => {
      const result = await controller.updateRole(1, Role.admin);
      expect(result).toEqual(mockUserAfterUpdateRole);
      expect(service.updateUserRole).toHaveBeenCalledWith(1, Role.admin);
    });
  });
});
