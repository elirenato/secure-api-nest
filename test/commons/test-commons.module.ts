import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BadRequestExceptionFilter } from '../../src/commons/exceptions/bad-request-exception.filter';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
  ],
  controllers: [],
})
export class TestCommonsModule {}
