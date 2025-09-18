import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WORKSPACE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'workspace',
            protoPath: join(__dirname, '../../../../../proto/workspace.proto'),
            url: configService.get<string>('WORKSPACE_SERVICE_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class WorkspaceClientModule {}
