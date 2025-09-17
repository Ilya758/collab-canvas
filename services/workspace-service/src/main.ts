import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'workspace',
      protoPath: join(__dirname, '../../../proto/workspace.proto'),
      url: '0.0.0.0:50052',
    },
  });
  await app.listen();
  console.log('Workspace microservice is listening');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
