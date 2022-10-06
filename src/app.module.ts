import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from './commons/commons.module';
import { SecurityModule } from './commons/security.module';
import { Country } from './countries/country.entity';
import { CountryModule } from './countries/country.module';
import { Customer } from './customers/customer.entity';
import { CustomerModule } from './customers/customer.module';
import { StateProvince } from './state-provinces/state-province.entity';
import { StateProvinceModule } from './state-provinces/state-province.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get('DATABASE_SYNCHRONIZE'),
        entities: [Country, StateProvince, Customer],
        autoLoadEntities: false,
      }),
    }),
    SecurityModule,
    CountryModule,
    StateProvinceModule,
    CustomerModule,
    CommonsModule,
  ],
})
export class AppModule {}
