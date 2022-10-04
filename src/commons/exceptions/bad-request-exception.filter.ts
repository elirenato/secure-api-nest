import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { StringUtils } from '../string-utils';

@Catch(BadRequestException)
export class BadRequestExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const messages = [];
    const i18n = getI18nContextFromArgumentsHost(host);
    const response = exception.getResponse() as any;
    response.message.forEach((item) => {
      messages.push(
        i18n.translate(`text.${item}`, {
          defaultValue: StringUtils.capitalize(item),
        }),
      );
    });
    this.buildErrorResponse(exception.getStatus(), messages, host);
  }
}
