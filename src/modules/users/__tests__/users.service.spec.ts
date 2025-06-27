import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser: User = {
    id: 1,
    username: 'Test',
    email: 'test@test.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'admin',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user by id', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const result = await service.getUserById(1);

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return user by email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const result = await service.getUserByEmail('test@test.com');

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
  });

  it('should create a new user and omit password', async () => {
    const inputUser = {
      email: 'test@test.com',
      username: 'Test',
      password: 'hashedPassword',
      role: Role.admin,
      updatedAt: new Date(),
    };

    const createdUser = {
      id: 1,
      ...inputUser,
      createdAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValue({
      ...createdUser,
      password: undefined,
    });
    const result = await service.createUser(inputUser);
    const { password, ...expectedUser } = createdUser;
    expect(result).toEqual(expectedUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: inputUser,
      omit: { password: true },
    });
  });

  it('should delete user and return username and email', async () => {
    const deletedUser = {
      username: mockUser.username,
      email: mockUser.email,
    };

    (prisma.user.delete as jest.Mock).mockResolvedValue(deletedUser);

    const result = await service.deleteUser(mockUser.id);
    expect(result).toEqual(deletedUser);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      select: { email: true, username: true },
    });
  });

  it('should update user and omit password', async () => {
    const updateData = { username: 'UpdatedName', updatedAt: new Date() };

    const updatedUser = { ...mockUser, ...updateData };
    const { password, ...expected } = updatedUser;

    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...updatedUser,
      password: undefined,
    });

    const result = await service.updateUser(mockUser.id, updateData);
    expect(result).toEqual(expected);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: updateData,
      omit: { password: true },
    });
  });

  it('should update user role and omit password', async () => {
    const newRole = Role.admin;

    const updatedUser = { ...mockUser, role: newRole };
    const { password, ...expected } = updatedUser;

    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...updatedUser,
      password: undefined,
    });

    const result = await service.updateUserRole(mockUser.id, newRole);
    expect(result).toEqual(expected);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { role: newRole },
      omit: { password: true },
    });
  });
});
