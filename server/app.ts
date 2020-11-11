import express, { ErrorRequestHandler, Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import { getRouteInfo, InversifyExpressServer } from 'inversify-express-utils';
// import { io } from 'socket.io-client';
import SocketServer, { Socket } from 'socket.io';
import path from 'path';
import cluster from 'cluster';

import { handleError } from './usecases/error';
import config from './config';
import container from './container';

mongoose.set('debug', config.mongooseDebug);

const PORT = config.port;

const server = new InversifyExpressServer(container, null, null);

server.setConfig((app) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.disable('etag');
});

server.setErrorConfig((app) => {
  app.use(((err: any, req: Request, res: Response, _) => {
    return handleError(err, res);
  }) as ErrorRequestHandler);
});

const app = server.build();

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../', 'client', 'dist')));

  app.get('*', (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../', 'client', 'dist', 'index.html'));
  });
}

const bootstrap = async (): Promise<void> => {
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
    app.listen(PORT, () => console.log(`Listening localhost:${PORT}`));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // @ts-ignore
    // const io = new SocketServer(server);
    // // const socket = io.listen(server);
    // io.on('connection', (socket: Socket) => {
    //   socket.on('test', (data: any) => {
    //     console.log(data);
    //   });
    // });

    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

/*if (cluster.isMaster) {
  // Create a worker for each CPU
  for (let i = 0; i < cpusLength; i++) {
    cluster.fork();
  }

  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });
  cluster.on('exit', (worker, code) => {
    console.log(`Worker died! Pid: ${worker.process.pid}. Code ${code}`);
    if (code === 1) {
      cluster.fork();
    }
  });
} else {
  bootstrap();
}*/

bootstrap();
