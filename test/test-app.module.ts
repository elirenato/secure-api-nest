import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MainModule } from '../src/main.module';
import { FakeAuthGuard } from './commons/fake-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
      isGlobal: true,
    }),
    MainModule,
  ],
})
export class TestAppModule {}
