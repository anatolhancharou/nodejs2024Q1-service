import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { readFile } from 'node:fs/promises';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  try {
    const file = await readFile('doc/api.yaml', { encoding: 'utf-8' });
    const swaggerDocument = parse(file);

    SwaggerModule.setup('docs', app, swaggerDocument);
  } catch {
    console.log('Swagger is not available');
  }

  const port = process.env.PORT || 4000;

  await app.listen(port, () => {
    console.log(`Server started on ${port} port`);
  });
}

bootstrap();
