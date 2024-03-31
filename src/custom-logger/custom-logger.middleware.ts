import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from './custom-logger.service';

@Injectable()
export class CustomLoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLogger: CustomLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;

    res.on('finish', async () => {
      const { statusCode, statusMessage } = res;

      const logData = {
        method,
        originalUrl,
        body,
        query,
        params,
        statusCode,
        statusMessage,
      };

      const formattedLog = JSON.stringify(logData, null, 2);

      if (statusCode >= 400 && statusCode < 500) {
        await this.customLogger.warn(formattedLog);
      } else if (statusCode >= 500) {
        await this.customLogger.error(formattedLog);
      } else {
        await this.customLogger.log(formattedLog);
      }
    });

    next();
  }
}
