import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from './exceptions/bad-request-exception.filter';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { QueryFailedExceptionFilter } from './exceptions/query-failed-exception.filter';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';

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
      useClass: QueryFailedExceptionFilter,
    },
  ],
  controllers: [],
})
export class CommonsModule {}
