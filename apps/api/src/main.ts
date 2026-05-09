import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.enableCors({
    origin: [process.env.WEB_URL || 'http://localhost:3001'],
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
