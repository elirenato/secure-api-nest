import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from './exceptions/bad-request-exception.filter';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [KeycloakConnectModule.register(`keycloak.json`)],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    // Global authentication guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Only controllers annotated with @Resource and @Scopes are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // Used by `@Roles` decorator with the optional `@AllowAnyRole` decorator for allowing any specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [],
})
export class CommonModule {}
