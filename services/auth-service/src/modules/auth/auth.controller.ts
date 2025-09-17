import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

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
}
