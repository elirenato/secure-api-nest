import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BaseExceptionFilter } from './base-exception.filter';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    let message: string;
    if (exception.driverError && exception.driverError.constraint) {
      const key = 'key.constraints.' + exception.driverError.constraint;
      message = i18n.translate(key, {
        defaultValue: null,
      });
    } else {
      message = null;
    }
    if (message) {
      this.buildErrorResponse(400, [message], host);
    } else {
      console.error(exception);
      this.buildErrorResponse(500, [], host);
    }
  }
}
