import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthenticatedSocket } from './types';

@Injectable()
export class WsAuthMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  create() {
    return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
      try {
        const token = socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
          return next(new WsException('Unauthorized'));
        }

        const payload = this.jwtService.verify<{ sub: number }>(token, {
          secret: process.env.JWT_SECRET_KEY,
        });

        const user = await this.prismaService.user.findUnique({
          where: { id: payload.sub },
        });

        if (!user) {
          return next(new WsException('Unauthorized: User not found'));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        console.log(error);
        next(new WsException('Authentication error'));
      }
    };
  }
}
