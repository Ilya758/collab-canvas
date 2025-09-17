import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthClientModule } from 'src/common/clients/auth-client.module';

@Module({
  imports: [AuthClientModule, PassportModule],
  controllers: [AuthController],
  providers: [
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService) =>
        new JwtStrategy(configService),
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
