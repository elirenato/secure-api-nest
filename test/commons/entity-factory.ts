import { faker } from '@faker-js/faker';
import { Customer } from '../../src/customers/customer.entity';
import { Country } from 'src/countries/country.entity';
import { StateProvince } from 'src/state-provinces/state-province.entity';

export abstract class EntityFactory {
  static createCountry(): Country {
    return {
      id: Number(faker.random.numeric()),
      name: faker.address.country(),
      abbreviation: faker.address.countryCode(),
    };
  }
  static createStateProvince(): StateProvince {
    return {
      id: Number(faker.random.numeric()),
      name: faker.address.state(),
      abbreviation: faker.address.stateAbbr(),
      country: EntityFactory.createCountry(),
    };
  }
  static createCustomer(): Customer {
    return {
      id: Number(faker.random.numeric()),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      address: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      postalCode: faker.address.zipCode(),
      stateProvince: EntityFactory.createStateProvince(),
    };
  }
}
