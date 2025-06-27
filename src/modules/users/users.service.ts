import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.create({ data, omit: { password: true } });
  }

  async updateUser(
    id: number,
    updateData: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.update({
      where: { id },
      data: { ...updateData },
      omit: { password: true },
    });
  }

  async deleteUser(
    id: number,
  ): Promise<{ username: string; email: string } | null> {
    return await this.prisma.user.delete({
      where: { id },
      select: { username: true, email: true },
    });
  }

  async updateUserRole(
    id: number,
    role: Role,
  ): Promise<Omit<User, 'password'> | null> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        role,
      },
      omit: {
        password: true,
      },
    });
  }
}
