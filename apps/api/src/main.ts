import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csurf from 'csurf';
import helmet from 'helmet';

import { AppModule } from '@modules/app/app.module';

async function bootstrap() {
  const logger = new Logger('Root');

  try {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.use(cookieParser());
    // TODO: check csrf
    // app.use(csurf({ cookie: true }));
    app.use(cors());

    // const config = new DocumentBuilder()
    //   .setTitle("Let's choose api")
    //   // .setDescription('The cats API description')
    //   .setVersion('1.0')
    //   .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);

    const configService = app.get(ConfigService);
    const port = configService.get('port');
    await app.listen(port);

    logger.log(`Server listening on port ${port}`);
  } catch (e) {
    logger.error('Critical error has occurred');
    process.exit(1);
  }
}
bootstrap();
