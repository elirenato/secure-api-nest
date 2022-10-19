import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityFactory } from '../commons/entity-factory';
import { TestHelper } from '../commons/test-helper';
import { Customer } from '../../src/entities/customer.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommonsModule } from '../../src/commons/commons.module';
import { CustomerController } from '../../src/controllers/customer.controller';
import { CustomerService } from '../../src/services/customer.service';
import { QueryFailedError } from 'typeorm';
import { faker } from '@faker-js/faker';

// Integration Tests for Customer Controller
describe('CustomerController', () => {
  const customerRepository = TestHelper.createMockRepository<
    Customer,
    number
  >();
  let app: INestApplication;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [CommonsModule],
      controllers: [CustomerController],
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: customerRepository,
        },
      ],
    }).compile();
    app = await TestHelper.createNestApplication(fixture);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('persistCustomer', () => {
    it('should persist customer with success', async () => {
      const customerInput = EntityFactory.createCustomer();
      jest.spyOn(customerRepository, 'insert');

      await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .send(customerInput)
        .expect(201);

      expect(customerRepository.insert).toBeCalledTimes(1);
      delete customerInput.id;
      expect(customerRepository.insert).toBeCalledWith(customerInput);
    });

    it('should return error when email already exists', async () => {
      const customerInput = EntityFactory.createCustomer();
      jest.spyOn(customerRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('', [], {
          constraint: 'customers_email_key',
        });
      });

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
      const customerInput = EntityFactory.createCustomer();
      jest.spyOn(customerRepository, 'insert').mockImplementation(() => {
        throw new QueryFailedError('', [], {
          constraint: 'customers_email_key',
        });
      });

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
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .send(customerInput)
        .expect(401);
    });

    it('should get 403 when persist customer without authorization', () => {
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['operators']))
        .send(customerInput)
        .expect(403);
    });
  });

  describe('updateCustomer', () => {
    it('should update customer with success', async () => {
      const newCustomerInput = EntityFactory.createCustomer();
      jest.spyOn(customerRepository, 'update').mockReturnValueOnce({
        affected: 1,
      });
      const id = Number(faker.random.numeric());

      await request(app.getHttpServer())
        .put('/api/customers/' + id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .send(newCustomerInput)
        .expect(200);

      expect(customerRepository.update).toBeCalledTimes(1);
      delete newCustomerInput.id;
      expect(customerRepository.update).toBeCalledWith(
        { id },
        newCustomerInput,
      );
    });

    it('should get 404 when update customer that does not exists', async () => {
      const newCustomerInput = EntityFactory.createCustomer();
      jest.spyOn(customerRepository, 'update').mockReturnValueOnce({
        affected: 0,
      });
      const id = Number(faker.random.numeric());

      await request(app.getHttpServer())
        .put('/api/customers/' + id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .send(newCustomerInput)
        .expect(404);

      expect(customerRepository.update).toBeCalledTimes(1);
      delete newCustomerInput.id;
      expect(customerRepository.update).toBeCalledWith(
        { id },
        newCustomerInput,
      );
    });

    it('should get 401 when update customer without authentication', async () => {
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .put('/api/customers/' + faker.random.numeric())
        .send(customerInput)
        .expect(401);
    });

    it('should get 403 when update customer without authorization', async () => {
      const customerInput = EntityFactory.createCustomer();
      return request(app.getHttpServer())
        .put('/api/customers/' + faker.random.numeric())
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['operators']))
        .send(customerInput)
        .expect(403);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer with success', async () => {
      jest.spyOn(customerRepository, 'delete').mockReturnValueOnce({
        affected: 1,
      });
      const id = Number(faker.random.numeric());

      await request(app.getHttpServer())
        .delete('/api/customers/' + id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .expect(200);

      expect(customerRepository.delete).toBeCalledTimes(1);
      expect(customerRepository.delete).toBeCalledWith(id);
    });

    it('should get 404 when delete customer that does not exists', async () => {
      jest.spyOn(customerRepository, 'delete').mockReturnValueOnce({
        affected: 0,
      });
      const id = Number(faker.random.numeric());

      await request(app.getHttpServer())
        .delete('/api/customers/' + id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['managers']))
        .expect(404);

      expect(customerRepository.delete).toBeCalledTimes(1);
      expect(customerRepository.delete).toBeCalledWith(id);
    });

    it('should get 401 when delete customer without authentication', () => {
      return request(app.getHttpServer())
        .delete('/api/customers/' + faker.random.numeric())
        .expect(401);
    });

    it('should get 403 when delete customer without authorization', () => {
      return request(app.getHttpServer())
        .delete('/api/customers/' + faker.random.numeric())
        .set('Authorization', 'Bearer ' + TestHelper.createToken(['operators']))
        .expect(403);
    });
  });

  describe('getCustomerById', () => {
    it('should get customer with success', async () => {
      const customerInput = EntityFactory.createCustomer();
      jest
        .spyOn(customerRepository, 'findOneByOrFail')
        .mockReturnValueOnce(Promise.resolve(customerInput));
      const id = Number(faker.random.numeric());

      const response = await request(app.getHttpServer())
        .get('/api/customers/' + id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(200);
      expect(response.body).toEqual(customerInput);
    });

    it('should get validation error when using an invalid id', async () => {
      const invalidId = faker.random.numeric() + 'str';
      const response = await request(app.getHttpServer())
        .get('/api/customers/' + invalidId)
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: `Id must be a valid number`,
          },
        ],
      });
    });
    it('should get 401 when get customer without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/customers/' + faker.random.numeric())
        .expect(401);
    });
  });

  describe('listAllCustomers', () => {
    it('should list all customers with success', async () => {
      const expectedCustomers = [EntityFactory.createCustomer()];
      jest
        .spyOn(customerRepository, 'find')
        .mockReturnValueOnce(Promise.resolve(expectedCustomers));

      const response = await request(app.getHttpServer())
        .get('/api/customers')
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(200);

      expect(customerRepository.find).toBeCalledWith({
        order: {
          lastName: 'asc',
          firstName: 'asc',
        },
      });
      expect(response.body).toEqual(expectedCustomers);
    });

    it('should get 401 when list all customers without authentication', () => {
      return request(app.getHttpServer()).get('/api/customers').expect(401);
    });
  });
});
