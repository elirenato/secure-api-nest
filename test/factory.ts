import { faker } from '@faker-js/faker';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';
import { Customer } from 'src/customers/customer.entity';

export async function createNestApplication(
  fixture: TestingModule,
): Promise<INestApplication> {
  const app = fixture.createNestApplication();
  app.useLogger(console);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
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
