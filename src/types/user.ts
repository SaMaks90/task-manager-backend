export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  admin = 'admin',
  user = 'user',
}
