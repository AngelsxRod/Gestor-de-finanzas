import { NestFactory } from '@nestjs/core';
import { configureApp } from './app.config.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3211);
  const host = process.env.HOST ?? '127.0.0.1';

  configureApp(app);
  await app.listen(port, host);
}
await bootstrap();
