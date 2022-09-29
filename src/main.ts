import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: true,
      },
    }),
  );
  console.log(process.env.KEYCLOAK_URL);
  await app.listen(8081);
}
bootstrap();
