import { Socket } from 'socket.io';

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  createdAt: Date;
  email: string;
  id: number;
  password: string;
  role: Role;
  updatedAt: Date;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: User;
  };
}
