import express, { ErrorRequestHandler, Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import path from 'path';

import { handleError } from './usecases/error';
import authRoutes from './routes/auth.routes';
import contestRoutes from './routes/contest.routes';
import userRoutes from './routes/user.routes';
import gameRoutes from './routes/game.routes';
import config from './config';

mongoose.set('debug', config.mongooseDebug);

const PORT = config.port;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

app.disable('etag');

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../', 'client', 'dist')));

  app.get('*', (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../', 'client', 'dist', 'index.html'));
  });
}

app.use(((err: any, req: Request, res: Response) =>
  handleError(err, res)) as ErrorRequestHandler);

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
    app.listen(PORT, () => console.log(`Listening localhost:${PORT}`));
    // await GameService.start('5f332014c17a495019dbc2e9');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
