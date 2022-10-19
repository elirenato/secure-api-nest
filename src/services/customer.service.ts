import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async persistCustomer(customerInput: Customer): Promise<void> {
    await this.customerRepository.insert(customerInput);
  }

  async updateCustomer(id: number, customerInput: Customer): Promise<void> {
    const result = await this.customerRepository.update({ id }, customerInput);
    if (result.affected <= 0) {
      throw new EntityNotFoundError(Customer, { id });
    }
  }

  async deleteCustomerById(id: number): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected <= 0) {
      throw new EntityNotFoundError(Customer, { id });
    }
  }

  listAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find({
      order: {
        lastName: 'asc',
        firstName: 'asc',
      },
    });
  }

  getCustomerById(id: number): Promise<Customer> {
    return this.customerRepository.findOneByOrFail({ id });
  }
}
