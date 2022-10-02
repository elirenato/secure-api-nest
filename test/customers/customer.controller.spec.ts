import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createCustomer,
  createMockRepository,
  createNestApplication,
} from '../factory';
import { CustomerController } from '../../src/customers/customer.controller';
import { Customer } from '../../src/customers/customer.entity';
import { CustomerService } from '../../src/customers/customer.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('CustomerController', () => {
  const customerService = {
    persistCustomer: jest.fn(),
  };
  let app: INestApplication;
  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: customerService,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    app = await createNestApplication(fixture);
  });
  describe('persistCustomer', () => {
    it('should call persistCustomer', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .send(customerInput)
        .expect(201)
        .then(() => {
          expect(customerService.persistCustomer).toBeCalledTimes(1);
          expect(customerService.persistCustomer).toBeCalledWith(customerInput);
        });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
