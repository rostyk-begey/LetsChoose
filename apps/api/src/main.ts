import { Config } from '@lets-choose/api/config';
import { API_ROUTES } from '@lets-choose/common/utils';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
// import csurf from 'csurf';
import helmet from 'helmet';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('Root');
  // mongoose.set('debug', true);

  try {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.use(cookieParser());
    // TODO: check csrf
    // app.use(csurf({ cookie: true }));
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });
    app.setGlobalPrefix(API_ROUTES.INDEX);

    const config = new DocumentBuilder()
      .setTitle("Let's choose api")
      // .setDescription('The cats API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(API_ROUTES.INDEX, app, document);

    const configService: ConfigService<Config> = app.get(ConfigService);
    const port = configService.get('port', { infer: true });
    await app.listen(port);

    logger.log(`Server listening on port ${port}`);
  } catch (e) {
    logger.error('Critical error has occurred');
    process.exit(1);
  }
}
bootstrap();
