import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.enableCors({
    origin: [env.webUrl],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Iskommerce')
    .setDescription('Iskommerce API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = Number(env.port) || 3000;
  const host = env.host || '0.0.0.0';

  await app.listen(port, host);
}

void bootstrap();
