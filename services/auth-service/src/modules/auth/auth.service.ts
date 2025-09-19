import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, password }: AuthDto): Promise<{ accessToken: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new RpcException({
        code: GrpcStatus.ALREADY_EXISTS,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { id, role } = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return {
      accessToken: this.jwtService.sign({
        email,
        sub: id,
        role,
      }),
    };
  }

  async signIn({ email, password }: AuthDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }

    return {
      accessToken: this.jwtService.sign({
        email,
        sub: user.id,
        role: user.role,
      }),
    };
  }

  async validateToken({ accessToken }: ValidateTokenDto): Promise<Omit<User, 'password'>> {
    try {
      const payload = this.jwtService.verify(accessToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new RpcException({
          code: GrpcStatus.UNAUTHENTICATED,
          message: 'Invalid token',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...validatedUser } = user;

      return validatedUser;
    } catch (e) {
      throw new RpcException({
        code: GrpcStatus.UNAUTHENTICATED,
        message: 'Invalid token',
      });
    }
  }
}
