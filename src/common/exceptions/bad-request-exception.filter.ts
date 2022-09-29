import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';

@Catch(BadRequestException)
export class BadRequestExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: BadRequestException, host: ArgumentsHost) {
    this.buildErrorResponse(
      exception.getStatus(),
      exception.getResponse(),
      host,
    );
  }
}
