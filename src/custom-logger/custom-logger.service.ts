import { Injectable, LoggerService } from '@nestjs/common';
import { appendFile, rename, stat } from 'node:fs/promises';
import { EOL } from 'node:os';
import { join } from 'node:path';
import { isExists } from 'src/utils';

enum LoggingLevels {
  error,
  warn,
  log,
  verbose,
}

const LoggingLevelMapper = {
  [LoggingLevels.error]: 'ERROR',
  [LoggingLevels.warn]: 'WARN',
  [LoggingLevels.log]: 'LOG',
  [LoggingLevels.verbose]: 'VERBOSE',
};

@Injectable()
export class CustomLoggerService implements LoggerService {
  static LOG_FOLDER = 'logs';
  LOGGING_LEVEL = +process.env.LOGGING_LEVEL ?? 3;
  MAX_FILE_SIZE = +process.env.MAX_FILE_SIZE || 1000;
  LOG_FILE_NAME = 'log-file.log';
  ERROR_LOG_FILE_NAME = 'error-file.log';

  async log(message: any, ...optionalParams: any[]) {
    await this.handleLogging(LoggingLevels.log, message, optionalParams);
  }

  async error(message: any, ...optionalParams: any[]) {
    await this.handleLogging(LoggingLevels.error, message, optionalParams);
  }

  async warn(message: any, ...optionalParams: any[]) {
    await this.handleLogging(LoggingLevels.warn, message, optionalParams);
  }

  async verbose(message: any, ...optionalParams: any[]) {
    await this.handleLogging(LoggingLevels.verbose, message, optionalParams);
  }

  private async handleLogging(
    level: LoggingLevels,
    message: any,
    optionalParams: any[],
  ) {
    if (level <= this.LOGGING_LEVEL) {
      const params = optionalParams.length
        ? `${optionalParams.join(' ')} `
        : '';
      const formattedMessage = `${new Date().toLocaleString()}\t${LoggingLevelMapper[level]} ${params}${message}${EOL}`;

      process.stdout.write(formattedMessage);

      try {
        const promises = [this.writeLogToFile(formattedMessage)];
        level === LoggingLevels.error &&
          promises.push(this.writeLogToFile(formattedMessage, true));

        await Promise.all(promises);
      } catch (error) {
        console.log(error);
      }
    }
  }

  private async writeLogToFile(message: string, isError?: boolean) {
    const fileName = isError ? this.ERROR_LOG_FILE_NAME : this.LOG_FILE_NAME;
    const filePath = join(CustomLoggerService.LOG_FOLDER, fileName);

    try {
      if (await isExists(filePath)) {
        const { size } = await stat(filePath);

        if (size >= this.MAX_FILE_SIZE * 1000) {
          const [baseName, ext] = fileName.split('.');
          const newFileName = `${baseName}_${Date.now()}.${ext}`;
          const newFilePath = join(CustomLoggerService.LOG_FOLDER, newFileName);

          await rename(filePath, newFilePath);
        }
      }
    } catch {
      // already renamed (probably due to multiple simultaneous async logs)
    }

    await appendFile(filePath, message);
  }
}
