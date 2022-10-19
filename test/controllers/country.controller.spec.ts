import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityFactory } from '../commons/entity-factory';
import { TestHelper } from '../commons/test-helper';
import { Country } from '../../src/entities/country.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { CommonsModule } from '../../src/commons/commons.module';
import { CountryController } from '../../src/controllers/country.controller';
import { CountryService } from '../../src/services/country.service';

// Integration Tests for Country Controller
describe('CountryController', () => {
  const countryRepository = TestHelper.createMockRepository<Country, number>();
  let app: INestApplication;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [CommonsModule],
      controllers: [CountryController],
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: countryRepository,
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

  describe('getCountryById', () => {
    it('should get country with success', async () => {
      const country = EntityFactory.createCountry();
      jest
        .spyOn(countryRepository, 'findOneByOrFail')
        .mockReturnValue(Promise.resolve(country));

      const response = await request(app.getHttpServer())
        .get('/api/countries/' + country.id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(200);

      expect(response.body).toEqual(country);
    });

    it('should get validation error when using an invalid id', async () => {
      const id = faker.random.numeric() + 'string';
      const response = await request(app.getHttpServer())
        .get('/api/countries/' + id)
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

    it('should get 401 when get country without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/countries/' + faker.random.numeric())
        .expect(401);
    });
  });

  describe('listAllCountries', () => {
    it('should list all countries with success', async () => {
      const countries = [EntityFactory.createCountry()];
      jest
        .spyOn(countryRepository, 'find')
        .mockReturnValue(Promise.resolve(countries));

      const response = await request(app.getHttpServer())
        .get('/api/countries')
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(200);

      expect(countryRepository.find).toBeCalledWith({
        order: {
          name: 'asc',
        },
      });
      expect(response.body).toEqual(countries);
    });

    it('should get 401 when list all countries without authentication', async () => {
      await request(app.getHttpServer()).get('/api/countries').expect(401);
    });
  });
});
