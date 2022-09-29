import { ArgumentsHost } from "@nestjs/common";
import { ErrorMessage } from "./error-response.model";
import { Request, Response } from 'express';

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
    } else {
      errors.push({
        message: 'Unexpected error.',
      });
    }
    response.status(status).json({
      errors: errors,
    });
  }
}
