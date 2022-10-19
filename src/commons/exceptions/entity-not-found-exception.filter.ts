import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const indexOf = exception.message.indexOf(':');
    const entityMessage = exception.message.slice(0, indexOf);
    const criteria = JSON.parse(exception.message.slice(indexOf + 1));
    const message = i18n.translate(`text.${entityMessage}`, {
      defaultValue: exception.message,
      args: criteria,
    });
    this.buildErrorResponse(404, [message], host);
  }
}
