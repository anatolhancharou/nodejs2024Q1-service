import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { readFile } from 'node:fs/promises';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const file = await readFile('./doc/api.yaml', { encoding: 'utf8' });
  const swaggerDocument = parse(file);

  SwaggerModule.setup('doc', app, swaggerDocument);

  const port = process.env.PORT || 4000;

  await app.listen(port, () => {
    console.log(`Server started on ${port} port`);
  });
}

bootstrap();
