import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async persistCustomer(customerInput: Customer): Promise<void> {
    customerInput.id = null;
    await this.customerRepository.insert(customerInput);
  }

  async updateCustomer(id: number, customerInput: Customer): Promise<void> {
    await this.customerRepository.update({ id }, customerInput);
  }

  async deleteCustomerById(id: number): Promise<void> {
    await this.customerRepository.delete(id);
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
    return this.customerRepository.findOneBy({ id });
  }
}
