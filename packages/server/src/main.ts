import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
// import * as cors from 'cors';
// import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from './modules/app/app.module';

// TODO: refactor
const whitelist = ['http://localhost:3000', 'http://localhost:4000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  // TODO: check csrf
  // app.use(csurf({ cookie: true }));
  // TODO: check cors
  // app.use(cors(corsOptions));
  const config = new DocumentBuilder()
    .setTitle("Let's choose api")
    // .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port, () => console.log(`Server listening on port ${port}`));
}
bootstrap();
