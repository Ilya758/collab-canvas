import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

import { type AuthenticatedSocket } from './types';
import { WsAuthMiddleware } from './ws-auth.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private readonly wsAuthMiddleware: WsAuthMiddleware,
    private readonly prismaService: PrismaService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    server.use(this.wsAuthMiddleware.create());
  }

  async handleConnection(client: AuthenticatedSocket) {
    const boardId = client.handshake.query.boardId as string;

    if (!boardId) {
      client.disconnect();
      return;
    }

    const {
      data: { user },
    } = client;

    const board = await this.prismaService.board.findUnique({
      where: { id: Number(boardId), authorId: user.id },
    });

    if (!board) {
      client.disconnect();
      return;
    }

    await client.join(boardId);
    client.emit('joinedBoard', `You have joined board ${client.handshake.query.boardId as string}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    this.server.to(client.id).emit('disconnected', `Client disconnected: ${client.id}`);
  }
}
