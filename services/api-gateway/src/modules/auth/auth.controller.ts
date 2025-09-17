import { Controller, Post, Body, OnModuleInit, Inject } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from 'src/common/interfaces';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
