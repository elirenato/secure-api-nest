import { faker } from '@faker-js/faker';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { FakeAuthGuard } from './fake-auth.guard';

export interface FakeRepository<T, Y> {
  insert(value: T);
  update(value: T);
  delete(number: Y);
  findOneByOrFail(number: Y): Promise<T>;
  find(): Promise<T[]>;
}

export abstract class TestHelper {
  static createToken(roles: string[] = []): string {
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
    app.useGlobalGuards(new FakeAuthGuard(reflector));
    app.useLogger(console);
    return await app.init();
  }

  static createMockRepository<T, Y>(): FakeRepository<T, Y> {
    return {
      insert: jest.fn<T, any>(),
      update: jest.fn<T, any>(),
      delete: jest.fn<number, any>(),
      findOneByOrFail: jest.fn<Promise<T>, any>(),
      find: jest.fn<Promise<T[]>, any>(),
    };
  }
}
