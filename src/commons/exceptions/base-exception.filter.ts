import { ArgumentsHost } from '@nestjs/common';
import { ErrorMessage } from './error-response.model';
import { Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

export abstract class BaseExceptionFilter {
  buildErrorResponse(status: number, exceptionBody: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors: ErrorMessage[] = [];
    if (exceptionBody && Array.isArray(exceptionBody.message)) {
      exceptionBody.message.forEach((item) => {
        errors.push({
          message: item,
        });
      });
    } else if (exceptionBody && typeof exceptionBody.message === 'string') {
      errors.push({
        message: exceptionBody.message,
      });
    } else if (typeof exceptionBody === 'string') {
      errors.push({
        message: exceptionBody,
      });
    } else {
      const i18n = getI18nContextFromArgumentsHost(host);
      errors.push({
        message: i18n.translate('messages.errors.unexpected'),
      });
    }
    response.status(status).json({
      errors: errors,
    });
  }
}
