import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';

@Controller('api/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles({ roles: ['realm:managers'] })
  persistCustomer(@Body() customerInput: Customer): Promise<void> {
    return this.customerService.persistCustomer(customerInput);
  }

  @Put(':id')
  @Roles({ roles: ['realm:managers'] })
  updateCustomer(
    @Param() params,
    @Body() customerInput: Customer,
  ): Promise<void> {
    return this.customerService.updateCustomer(params.id, customerInput);
  }

  @Delete(':id')
  @Roles({ roles: ['realm:managers'] })
  deleteCustomerById(@Param() params): Promise<void> {
    return this.customerService.deleteCustomerById(params.id);
  }

  @Get(':id')
  getCustomerById(@Param() params): Promise<Customer> {
    return this.customerService.getCustomerById(params.id);
  }

  @Get()
  listAllCustomers(): Promise<Customer[]> {
    return this.customerService.listAllCustomers();
  }
}
