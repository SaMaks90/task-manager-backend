import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
  }
}
