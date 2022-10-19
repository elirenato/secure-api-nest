import { ArgumentsHost } from '@nestjs/common';
import { ErrorMessage } from './error-response.model';
import { Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

export abstract class BaseExceptionFilter {
  buildErrorResponse(status: number, messages: string[], host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors: ErrorMessage[] = [];
    messages.forEach((message) => {
      errors.push({
        message: message,
      });
    });
    if (errors.length <= 0) {
      const i18n = getI18nContextFromArgumentsHost(host);
      errors.push({
        message: i18n.translate('key.errors.unexpected'),
      });
    }
    response.status(status).json({
      errors: errors,
    });
  }
}
