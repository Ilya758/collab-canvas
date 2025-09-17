import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcToHttpExceptionFilter } from './common/filters/rpc-to-http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsAllowedHeaders = configService.get<string>('CORS_ALLOWED_HEADERS');
  const corsCredentials =
    configService.get<boolean>('CORS_CREDENTIALS') ?? true;
  const corsExposedHeaders = configService.get<string>('CORS_EXPOSED_HEADERS');
  const corsMethods = (configService.get<string>('CORS_METHODS') ?? '').split(
    ', ',
  );
  const corsOrigins = (configService.get<string>('CORS_ORIGINS') ?? '').split(
    ', ',
  );

  app.enableCors({
    allowedHeaders: corsAllowedHeaders,
    credentials: corsCredentials,
    exposedHeaders: corsExposedHeaders,
    methods: corsMethods,
    origin: (
      origin: string,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || !corsOrigins.includes(origin)) {
        callback(new ForbiddenException('Not allowed by CORS'), false);
        return;
      }

      callback(null, true);
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const enableSwagger =
    (configService.get<string>('ENABLE_SWAGGER') ?? '').toLowerCase() ===
      'true' || configService.get<string>('NODE_ENV') === 'development';

  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Project Service API')
      .setDescription('API documentation for the Project Service')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('PORT') ?? 3000;
  app.useGlobalFilters(new RpcToHttpExceptionFilter());
  await app.listen(port);
}
bootstrap();
