import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setUpSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Dshop')
    .setDescription('API for Dshop')
    .setVersion('1.1')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
