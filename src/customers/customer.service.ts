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

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  findOne(id: number): Promise<Customer> {
    return this.customerRepository.findOneBy({ id });
  }

  async persistCustomer(customerInput: Customer): Promise<void> {
    await this.customerRepository.insert(customerInput);
  }

  async remove(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
