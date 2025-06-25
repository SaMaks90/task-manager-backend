export interface IUser {
  email: string;
  password: string;
  id: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN,
  USER,
}
