import { User } from 'generated/prisma';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: User;
  };
}
