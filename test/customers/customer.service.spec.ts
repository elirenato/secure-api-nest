import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestHelper } from '../commons/test-helper';
import { EntityFactory } from '../commons/entity-factory';
import { Customer } from '../../src/customers/customer.entity';
import { CustomerService } from '../../src/customers/customer.service';
import { faker } from '@faker-js/faker';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('CustomerService', () => {
  let customerService: CustomerService;
  const customerRepository = TestHelper.createMockRepository();
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerService],
      providers: [
        {
          provide: getRepositoryToken(Customer),
          useValue: customerRepository,
        },
      ],
    }).compile();
    customerService = app.get<CustomerService>(CustomerService);
  });
  describe('persistCustomer', () => {
    it('should call insert', async () => {
      jest.spyOn(customerRepository, 'insert');
      const customerInput = EntityFactory.createCustomer();
      await customerService.persistCustomer(customerInput).then(() => {
        const expectedCustomerInput = Object.assign(
          { id: null },
          customerInput,
        );
        expect(customerRepository.insert).toBeCalledTimes(1);
        expect(customerRepository.insert).toBeCalledWith(expectedCustomerInput);
      });
    });
  });
  describe('updateCustomer', () => {
    it('should call update', async () => {
      jest.spyOn(customerRepository, 'update').mockReturnValue(<UpdateResult>{
        affected: 1,
      });
      const customerInput = EntityFactory.createCustomer();
      const id = Number(faker.random.numeric());
      await customerService.updateCustomer(id, customerInput).then(() => {
        expect(customerRepository.update).toBeCalledTimes(1);
        expect(customerRepository.update).toBeCalledWith({ id }, customerInput);
      });
    });
    it('should thrown EntityNotFoundError', async () => {
      jest.spyOn(customerRepository, 'update').mockReturnValue(<UpdateResult>{
        affected: 0,
      });
      const customerInput = EntityFactory.createCustomer();
      const id = Number(faker.random.numeric());
      await customerService.updateCustomer(id, customerInput).catch((error) => {
        expect(error.message).toBe(
          `Could not find any entity of type "Customer" matching: {\n    "id": ${id}\n}`,
        );
      });
    });
  });
  describe('getCustomerById', () => {
    it('should call findOne', async () => {
      const customerEntity = EntityFactory.createCustomer();
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(customerEntity));
      await customerService
        .getCustomerById(customerEntity.id)
        .then((customerReceived) => {
          expect(customerReceived).toBe(customerEntity);
          expect(customerRepository.findOneBy).toBeCalledTimes(1);
          expect(customerRepository.findOneBy).toBeCalledWith({
            id: customerEntity.id,
          });
        });
    });
  });
  describe('deleteCustomerById', () => {
    it('should call delete', async () => {
      const id = Number(faker.random.numeric());
      jest.spyOn(customerRepository, 'delete').mockReturnValue(<DeleteResult>{
        affected: 1,
      });
      await customerService.deleteCustomerById(id).then(() => {
        expect(customerRepository.delete).toBeCalledTimes(1);
        expect(customerRepository.delete).toBeCalledWith(id);
      });
    });
    it('should thrown EntityNotFoundError', async () => {
      jest.spyOn(customerRepository, 'delete').mockReturnValue(<DeleteResult>{
        affected: 0,
      });
      const id = Number(faker.random.numeric());
      await customerService.deleteCustomerById(id).catch((error) => {
        expect(error.message).toBe(
          `Could not find any entity of type "Customer" matching: {\n    "id": ${id}\n}`,
        );
      });
    });
  });
  describe('listAllCustomers', () => {
    it('should call find with order by', async () => {
      const customers = [
        EntityFactory.createCustomer(),
        EntityFactory.createCustomer(),
      ];
      jest
        .spyOn(customerRepository, 'find')
        .mockReturnValue(Promise.resolve(customers));
      await customerService.listAllCustomers().then(() => {
        expect(customerRepository.find).toBeCalledTimes(1);
        expect(customerRepository.find).toBeCalledWith({
          order: {
            lastName: 'asc',
            firstName: 'asc',
          },
        });
      });
    });
  });
});
