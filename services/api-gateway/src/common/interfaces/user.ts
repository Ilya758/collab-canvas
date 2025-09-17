export interface User {
  createdAt: Date;
  email: string;
  id: number;
  password: string;
  role: Role;
  updatedAt: Date;
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
