import { faker } from '@faker-js/faker';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import { Customer } from '../../src/customers/customer.entity';
import * as jwt from 'jsonwebtoken';
import { BadRequestExceptionFilter } from '../../src/commons/exceptions/bad-request-exception.filter';
import { FakeAuthGuard } from './fake-auth.guard';
import { QueryFailedExceptionFilter } from '../../src/commons/exceptions/query-failed-exception.filter';

export function createToken(roles: string[]): string {
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

export async function createNestApplication(
  fixture: TestingModule,
): Promise<INestApplication> {
  const app = fixture.createNestApplication();
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new FakeAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new QueryFailedExceptionFilter(),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  return await app.init();
}

export function createMockRepository(): any {
  return {
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };
}

export function createCustomer(): Customer {
  return {
    id: Number(faker.random.numeric()),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    address2: faker.address.secondaryAddress(),
    postalCode: faker.address.zipCode(),
  };
}
