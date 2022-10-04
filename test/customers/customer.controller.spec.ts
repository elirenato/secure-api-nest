import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createCustomer,
  createMockRepository,
  createNestApplication,
  createToken,
} from '../commons/factory';
import { CustomerController } from '../../src/customers/customer.controller';
import { Customer } from '../../src/customers/customer.entity';
import { CustomerService } from '../../src/customers/customer.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { QueryFailedError } from 'typeorm';
import { CommonsModule } from '../../src/commons/commons.module';

describe('CustomerController', () => {
  const customerService = {
    persistCustomer: jest.fn(),
  };
  let app: INestApplication;
  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      imports: [CommonsModule],
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
    it('should persist customer with success', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + createToken(['managers']))
        .send(customerInput)
        .expect(201)
        .then(() => {
          expect(customerService.persistCustomer).toBeCalledTimes(1);
          expect(customerService.persistCustomer).toBeCalledWith(customerInput);
        });
    });
    it('should return error when email already exists', async () => {
      jest.spyOn(customerService, 'persistCustomer').mockImplementation(() => {
        throw new QueryFailedError('', [], {
          constraint: 'customers_email_key',
        });
      });
      const customerInput = createCustomer();
      const response = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + createToken(['managers']))
        .send(customerInput)
        .expect(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'There is already a customer with this email.',
          },
        ],
      });
    });
    it('should return error when email already exists portuguese', async () => {
      jest.spyOn(customerService, 'persistCustomer').mockImplementation(() => {
        throw new QueryFailedError('', [], {
          constraint: 'customers_email_key',
        });
      });
      const customerInput = createCustomer();
      const response = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + createToken(['managers']))
        .set('Accept-language', 'pt-BR')
        .send(customerInput)
        .expect(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'Já existe um cliente com este email.',
          },
        ],
      });
    });
    it('should get 401 when persist customer without authentication', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .send(customerInput)
        .expect(401);
    });
    it('should get 403 when persist customer without authorization', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + createToken(['operators']))
        .send(customerInput)
        .expect(403);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
