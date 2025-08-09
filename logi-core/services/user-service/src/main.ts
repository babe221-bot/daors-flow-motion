import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller('users')
class UsersController {
  @Get('me')
  me() {
    return { id: 'dev', roles: ['ADMIN'], email: 'dev@example.com' };
  }
}

@Module({ controllers: [UsersController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`User Service listening on ${port}`);
}

bootstrap();