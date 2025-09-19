import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from 'generated/prisma';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SignUp')
  signUp(dto: AuthDto): Promise<{ accessToken: string }> {
    return this.authService.signUp(dto);
  }

  @GrpcMethod('AuthService', 'SignIn')
  signIn(dto: AuthDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(dto: ValidateTokenDto): Promise<Omit<User, 'password'>> {
    return this.authService.validateToken(dto);
  }
}
