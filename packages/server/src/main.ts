import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
// import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from './modules/app/app.module';

// TODO: refactor
const whitelist = ['http://localhost:3000'];
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
  app.use(cors(corsOptions));
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
}
bootstrap();
