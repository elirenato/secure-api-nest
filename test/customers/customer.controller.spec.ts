import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityFactory } from '../commons/entity-factory';
import { TestHelper } from '../commons/test-helper';
import { CustomerController } from '../../src/customers/customer.controller';
import { Customer } from '../../src/customers/customer.entity';
import { CustomerService } from '../../src/customers/customer.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EntityNotFoundError, QueryFailedError, UpdateResult } from 'typeorm';
import { CommonsModule } from '../../src/commons/commons.module';

describe('CustomerController', () => {
  const customerService = {
    persistCustomer: jest.fn(),
    updateCustomer: jest.fn(),
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
          useValue: TestHelper.createMockRepository(),
        },
      ],
    }).compile();
    app = await TestHelper.createNestApplication(fixture);
  });
  describe('persistCustomer', () => {
    it('should persist customer with success', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
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
      const customerInput = EntityFactory.createCustomer();
      const response = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .send(customerInput)
        .expect(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'There is already a customer with this email',
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
      const customerInput = EntityFactory.createCustomer();
      const response = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .set('Accept-language', 'pt-BR')
        .send(customerInput)
        .expect(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'Já existe um cliente com este email',
          },
        ],
      });
    });
    it('should return error when input is invalid', async () => {
      jest.spyOn(customerService, 'persistCustomer').mockImplementation(() => {
        throw new QueryFailedError('', [], {
          constraint: 'customers_email_key',
        });
      });
      const customerInput = new Customer();
      const response = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .send(customerInput)
        .expect(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'First name should not be empty',
          },
          {
            message: 'Last name should not be empty',
          },
          {
            message: 'Email must be an email',
          },
          {
            message: 'Address should not be empty',
          },
          {
            message: 'Postal code should not be empty',
          },
          {
            message: 'State or Province should not be empty',
          },
        ],
      });
    });
    it('should get 401 when persist customer without authentication', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .send(customerInput)
        .expect(401);
    });
    it('should get 403 when persist customer without authorization', () => {
      jest
        .spyOn(customerService, 'persistCustomer')
        .mockReturnValue(Promise.resolve());
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['operators']))
        .send(customerInput)
        .expect(403);
    });
    describe('updateCustomer', () => {
      it('should update customer with success', () => {
        jest
          .spyOn(customerService, 'updateCustomer')
          .mockReturnValue(Promise.resolve());
        const customerInput = EntityFactory.createCustomer();
        return request(app.getHttpServer())
          .put('/api/customers/' + customerInput.id)
          .set(
            'Authorization',
            'Bearer ' + TestHelper.createToken(['managers']),
          )
          .send(customerInput)
          .expect(200)
          .then(() => {
            expect(customerService.updateCustomer).toBeCalledTimes(1);
            expect(customerService.updateCustomer).toBeCalledWith(
              customerInput.id,
              customerInput,
            );
          });
      });
      it('should get 401 when update customer without authentication', () => {
        jest
          .spyOn(customerService, 'updateCustomer')
          .mockReturnValue(Promise.resolve());
        const customerInput = EntityFactory.createCustomer();
        return request(app.getHttpServer())
          .put('/api/customers/' + customerInput.id)
          .send(customerInput)
          .expect(401);
      });
      it('should get 403 when update customer without authorization', () => {
        jest
          .spyOn(customerService, 'updateCustomer')
          .mockReturnValue(Promise.resolve());
        const customerInput = EntityFactory.createCustomer();
        return request(app.getHttpServer())
          .put('/api/customers/' + customerInput.id)
          .set(
            'Authorization',
            'Bearer ' + TestHelper.createToken(['operators']),
          )
          .send(customerInput)
          .expect(403);
      });
      it('should get 404 when update customer that does not exists', async () => {
        const customerInput = EntityFactory.createCustomer();
        jest.spyOn(customerService, 'updateCustomer').mockImplementation(() => {
          throw new EntityNotFoundError(Customer, { id: customerInput.id });
        });
        const response = await request(app.getHttpServer())
          .put('/api/customers/' + customerInput.id)
          .set(
            'Authorization',
            'Bearer ' + TestHelper.createToken(['managers']),
          )
          .send(customerInput)
          .expect(404);
        expect(response.body).toEqual({
          errors: [
            {
              message: `Could not find any \"Customer\" matching id ${customerInput.id}`,
            },
          ],
        });
      });
    });
    afterEach(async () => {
      await app.close();
    });
  });
});
