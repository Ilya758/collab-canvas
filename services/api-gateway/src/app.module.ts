import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { BoardsModule } from './modules/boards/boards.module';
import { ElementsModule } from './modules/elements/elements.module';

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    BoardsModule,
    ElementsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
})
export class AppModule {}
