import { Prisma } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto
  implements
    Partial<
      Pick<
        Prisma.UserUpdateInput,
        'username' | 'email' | 'updatedAt' | 'password'
      >
    >
{
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, {
    message: 'Password must be no more than 32 characters long',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/, {
    message:
      'Password too weak (should include uppercase, lowercase, number, special char)',
  })
  password?: string;
}
