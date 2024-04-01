import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly customLogger: CustomLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const responseBody = {
      statusCode,
      message,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    const logMessage =
      exception instanceof HttpException
        ? exception
        : 'Exception: Internal server error';

    this.customLogger.error(logMessage);

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
