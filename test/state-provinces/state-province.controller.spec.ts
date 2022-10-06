import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityFactory } from '../commons/entity-factory';
import { TestHelper } from '../commons/test-helper';
import { StateProvince } from '../../src/state-provinces/state-province.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { CommonsModule } from '../../src/commons/commons.module';
import { StateProvinceController } from '../../src/state-provinces/state-province.controller';
import { StateProvinceService } from '../../src/state-provinces/state-province.service';

// Integration Tests for State Province Controller
describe('StateProvinceController', () => {
  let stateProvinceRepository = TestHelper.createMockRepository<
    StateProvince,
    number
  >();
  let app: INestApplication;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      imports: [CommonsModule],
      controllers: [StateProvinceController],
      providers: [
        StateProvinceService,
        {
          provide: getRepositoryToken(StateProvince),
          useValue: stateProvinceRepository,
        },
      ],
    }).compile();
    app = await TestHelper.createNestApplication(fixture);
    stateProvinceRepository = fixture.get(getRepositoryToken(StateProvince));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getStateProvinceById', () => {
    it('should get state province with success', async () => {
      const stateProvince = EntityFactory.createStateProvince();
      jest
        .spyOn(stateProvinceRepository, 'findOneByOrFail')
        .mockReturnValue(Promise.resolve(stateProvince));

      const response = await request(app.getHttpServer())
        .get('/api/state-provinces/' + stateProvince.id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(200);

      expect(response.body).toEqual(stateProvince);
    });

    it('should get validation error when using an invalid id', async () => {
      const id = faker.random.numeric() + 'string';
      const response = await request(app.getHttpServer())
        .get('/api/state-provinces/' + id)
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

    it('should get 401 when get state provinces without authentication', () => {
      request(app.getHttpServer())
        .get('/api/state-provinces/' + faker.random.numeric())
        .expect(401);
    });
  });

  describe('listAllStateProvinces', () => {
    it('should list all state provinces with success', async () => {
      const stateProvince = EntityFactory.createStateProvince();
      const expectedStateProvinces = [stateProvince];
      jest
        .spyOn(stateProvinceRepository, 'find')
        .mockReturnValue(Promise.resolve(expectedStateProvinces));

      const response = await request(app.getHttpServer())
        .get('/api/state-provinces?country=' + stateProvince.country.id)
        .set('Authorization', 'Bearer ' + TestHelper.createToken())
        .expect(200);

      expect(stateProvinceRepository.find).toBeCalledWith({
        order: {
          name: 'asc',
        },
        where: {
          country: {
            id: stateProvince.country.id,
          },
        },
      });
      expect(response.body).toEqual(expectedStateProvinces);
    });

    it('should get 401 when list all state provinces without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/state-provinces')
        .expect(401);
    });
  });
});
