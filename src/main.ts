/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { config } from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ARU ALUMNI CONNECT API')
    .setDescription('An API for connecting ARU Alumni')
    .setVersion('1.0')
    .setContact(
      'Support Team',
      'https://aru-alumni-connect.com',
      'support@aru-alumni-connect.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Auth', 'Endpoints related to authentication')
    .addTag('Users', 'Endpoints for user management')
    .addTag('admin', 'Admin-only endpoints')
    .addTag('Notifications', 'Endpoints for handling notifications')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const swagger = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, swagger, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  app.enableCors();

  await app.listen(port);
  console.log(`Application is running on port ${port}`);
  console.log(`API Documentation available at httt://localhost:${port}/api`);
}
bootstrap();
