import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }));
  
  // Enable CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  });

  // Trust proxy headers (for correct IP addresses behind load balancers)
  app.set('trust proxy', true);

  const port = process.env.PORT || 4001;
  await app.listen(port);
  
  console.log(`🚀 Enhanced User Service is running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/users/health`);
  console.log(`👥 User endpoints: http://localhost:${port}/users`);
  console.log(`🔍 Search users: http://localhost:${port}/users/search?q=term`);
  console.log(`📈 User stats: http://localhost:${port}/users/stats`);
}

bootstrap().catch(error => {
  console.error('Failed to start User Service:', error);
  process.exit(1);
});