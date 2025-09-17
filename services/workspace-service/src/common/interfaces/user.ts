export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
