import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonsModule } from './commons/commons.module';
import { SecurityModule } from './commons/security.module';
import { CustomerModule } from './customers/customer.module';
import { CountryModule } from './countries/country.module';
import { StateProvinceModule } from './state-provinces/state-province.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [],
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
      autoLoadEntities: true,
    }),
    SecurityModule,
    CountryModule,
    StateProvinceModule,
    CustomerModule,
    CommonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
