import { faker } from '@faker-js/faker';
import { Customer } from '../../src/entities/customer.entity';
import { Country } from '../../src/entities/country.entity';
import { StateProvince } from '../../src/entities/state-province.entity';

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
      country: EntityFactory.createCountry() as Country,
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
