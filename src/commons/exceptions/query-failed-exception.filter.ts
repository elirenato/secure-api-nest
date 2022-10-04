import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BaseExceptionFilter } from './base-exception.filter';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const key = 'messages.constraints.' + exception.driverError.constraint;
    const message = i18n.translate(key);
    if (key === message) {
      console.error(exception);
      this.buildErrorResponse(500, null, host);
    } else {
      this.buildErrorResponse(400, message, host);
    }
  }
}
