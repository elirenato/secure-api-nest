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

@Module({
  imports: [
    KeycloakConnectModule.register(`keycloak.json`, {
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
    }),
  ],
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
    // Used by `@Roles` decorator with the optional `@AllowAnyRole` decorator for allowing any specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [],
})
export class CommonsModule {}
