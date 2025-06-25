import { Injectable } from '@nestjs/common';
import { IUser, UserRole } from '../../types';

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      id: '1',
      email: 'test@gmail.com',
      password: '123456',
      role: UserRole.ADMIN,
    },
  ];

  getUserByEmail(email: string): IUser | null {
    const findUsers: IUser[] = this.users.filter(
      (user) => user.email === email,
    );

    return findUsers.length ? findUsers[0] : null;
  }

  getUserById(id: string): IUser | null {
    const findUsers: IUser[] = this.users.filter((user) => user.id === id);

    return findUsers.length ? findUsers[0] : null;
  }
}
