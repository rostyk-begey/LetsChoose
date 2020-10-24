import express, { ErrorRequestHandler, Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { getRouteInfo, InversifyExpressServer } from 'inversify-express-utils';
import next from '../client-next/node_modules/next';
import path from 'path';

import { handleError } from './usecases/error';
import config from './config';
import container from './container';

mongoose.set('debug', config.mongooseDebug);

const PORT = config.port;

const dev = process.env.NODE_ENV === 'development';

const nextApp = next({ dev, dir: path.join(__dirname, '../', 'client-next') });
const nextAppHandle = nextApp.getRequestHandler();
const server = new InversifyExpressServer(container, null, null);

server.setConfig((app) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.disable('etag');
});

(async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });

    await nextApp.prepare();

    server.setErrorConfig((app) => {
      app.use(((err: any, req: Request, res: Response, _) => {
        return handleError(err, res);
      }) as ErrorRequestHandler);
    });

    const app = server.build();

    // if (process.env.NODE_ENV === 'production') {
    //   app.use(
    //     '/',
    //     express.static(path.join(__dirname, '../', 'client', 'dist')),
    //   );
    //
    //   app.get('*', (req: Request, res: Response): void => {
    //     res.sendFile(
    //       path.join(__dirname, '../', 'client', 'dist', 'index.html'),
    //     );
    //   });
    // }
    app.get('*', (req: Request, res: Response) => nextAppHandle(req, res));

    app.listen(PORT, () => console.log(`Listening localhost:${PORT}`));
    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
