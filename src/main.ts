import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { mkdir, readFile } from 'node:fs/promises';
import { AppModule } from './app.module';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { isExists } from './utils';
import { CustomExceptionFilter } from './exception-filters/custom-exception.filter';

async function bootstrap() {
  if (!(await isExists(CustomLoggerService.LOG_FOLDER))) {
    await mkdir(CustomLoggerService.LOG_FOLDER);
  }

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const httpAdapter = app.get(HttpAdapterHost);
  const customLogger = app.get(CustomLoggerService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new CustomExceptionFilter(httpAdapter, customLogger));
  app.useLogger(customLogger);

  try {
    const file = await readFile('doc/api.yaml', { encoding: 'utf-8' });
    const swaggerDocument = parse(file);

    SwaggerModule.setup('doc', app, swaggerDocument);
  } catch {
    await customLogger.warn('Swagger is not available');
  }

  const port = process.env.PORT || 4000;

  await app.listen(port, async () => {
    await customLogger.log(`Server started on ${port} port`);
  });

  process.on('uncaughtException', async (error) => {
    await customLogger.error(
      error.message,
      error.stack,
      '[Uncaught Exception]',
    );
    app.close();
  });

  process.on('unhandledRejection', async (error) => {
    await customLogger.error(error, '[Unhandled Rejection]');
  });
}

bootstrap();

// setTimeout(() => {
//   throw new Error('Uncaught error!');
// }, 5000);

// setTimeout(() => Promise.reject(), 5000);
