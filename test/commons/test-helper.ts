import { faker } from '@faker-js/faker';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { BadRequestExceptionFilter } from '../../src/commons/exceptions/bad-request-exception.filter';
import { FakeAuthGuard } from './fake-auth.guard';
import { QueryFailedErrorFilter } from '../../src/commons/exceptions/query-failed-error.filter';

export abstract class TestHelper {
  static createToken(roles: string[]): string {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    const payload = {
      exp: Math.floor(now.getTime() / 1000),
      iat: Math.floor(Date.now() / 1000),
      realm_access: {
        roles: roles,
      },
      email_verified: true,
      name: faker.name.fullName(),
      preferred_username: faker.internet.userName,
      given_name: faker.name.firstName(),
      family_name: faker.name.lastName(),
      email: faker.internet.email(),
    };
    return jwt.sign(payload, 'secret');
  }
  static async createNestApplication(
    fixture: TestingModule,
  ): Promise<INestApplication> {
    const app = fixture.createNestApplication();
    const reflector = app.get(Reflector);
    // app.useLogger(console);
    app.useGlobalGuards(new FakeAuthGuard(reflector));
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    return await app.init();
  }

  static createMockRepository(): any {
    return {
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
    };
  }
}
