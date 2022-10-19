import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { BadRequestExceptionFilter } from './exceptions/bad-request-exception.filter';
import { QueryFailedErrorFilter } from './exceptions/query-failed-error.filter';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { EntityNotFoundErrorFilter } from './exceptions/entity-not-found-exception.filter';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundErrorFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [],
})
export class CommonsModule {}
