import { Role } from '@prisma/client';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, {
    message: 'Password must be no more than 32 characters long',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/, {
    message:
      'Password too weak (should include uppercase, lowercase, number, special char)',
  })
  password: string;

  @IsString()
  username: string;

  @IsString()
  role: Role;
}
