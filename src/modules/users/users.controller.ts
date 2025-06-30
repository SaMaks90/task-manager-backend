import {
  Controller,
  HttpStatus,
  HttpCode,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ username: string; email: string } | null> {
    return this.usersService.deleteUser(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') newRole: Role,
  ): Promise<Omit<User, 'password'> | null> {
    return this.usersService.updateUserRole(id, newRole);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
