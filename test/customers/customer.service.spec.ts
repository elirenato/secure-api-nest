import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createCustomer, createMockRepository } from '../factory';
import { Customer } from '../../src/customers/customer.entity';
import { CustomerService } from '../../src/customers/customer.service';
import { faker } from '@faker-js/faker';

describe('CustomerService', () => {
  let customerService: CustomerService;
  const customerRepository = createMockRepository();
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
      const customerInput = createCustomer();
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
      jest.spyOn(customerRepository, 'update');
      const customerInput = createCustomer();
      const id = Number(faker.random.numeric());
      await customerService.updateCustomer(id, customerInput).then(() => {
        expect(customerRepository.update).toBeCalledTimes(1);
        expect(customerRepository.update).toBeCalledWith({ id }, customerInput);
      });
    });
  });
  describe('getCustomerById', () => {
    it('should call findOne', async () => {
      const customerEntity = createCustomer();
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
      jest
        .spyOn(customerRepository, 'delete')
        .mockReturnValue(Promise.resolve());
      await customerService.deleteCustomerById(id).then(() => {
        expect(customerRepository.delete).toBeCalledTimes(1);
        expect(customerRepository.delete).toBeCalledWith(id);
      });
    });
  });
  describe('listAllCustomers', () => {
    it('should call find with order by', async () => {
      const customers = [createCustomer(), createCustomer()];
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
