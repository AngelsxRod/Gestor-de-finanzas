import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './app.config.js';
import { AppModule } from './app.module.js';
import type { Environment } from './config/environment.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<Environment, true>);

  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(config.get('PORT'), config.get('HOST'));
}
await bootstrap();
