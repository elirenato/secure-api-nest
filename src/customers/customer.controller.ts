import { Body, Controller, Post } from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Controller('api/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  persistCustomer(@Body() customerInput: Customer): Promise<void> {
    return this.customerService.persistCustomer(customerInput);
  }
}
