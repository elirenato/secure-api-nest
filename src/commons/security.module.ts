import { Module } from '@nestjs/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakConnectModule.register(`.keycloak.json`, {
      policyEnforcement: PolicyEnforcementMode.ENFORCING,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [],
})
export class SecurityModule {}
