import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module.js';
import { env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Iskommerce')
      .setDescription('Iskommerce API')
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(openApiDoc));

  app.enableCors({
    origin: [env.webUrl],
    credentials: true,
  });

  const port = Number(env.port) || 3000;
  const host = env.host || '0.0.0.0';

  await app.listen(port, host);
}

void bootstrap();
