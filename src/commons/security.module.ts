import { Module } from '@nestjs/common';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get('KEYCLOAK_AUTH_SERVER_URL'),
        realm: configService.get('KEYCLOAK_REALM'),
        clientId: configService.get('KEYCLOAK_CLIENT_ID'),
        secret: configService.get('KEYCLOAK_CLIENT_SECRET'),
        public: false,
        tokenValidation: configService.get('KEYCLOAK_TOKEN_VALIDATION'),
        realmPublicKey: configService.get('KEYCLOAK_REALM_PUBLIC_KEY'),
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      }),
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
