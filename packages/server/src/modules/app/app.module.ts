import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RenderModule } from 'nest-next';
import Next from 'next';
import * as path from 'path';

import { RedirectAuthenticatedMiddleware } from '../../middlewares/redirect-authenticated.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContestModule } from '../contest/contest.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import config from '../../config';
import { GameModule } from '../game/game.module';

const packagesPath = path.join(__dirname, '..', '..', '..', '..');
const rootPath = path.join(packagesPath, '..');
const clientPath = path.join(packagesPath, 'client-next');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(rootPath, '.env'),
      load: [config],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    // RenderModule.forRootAsync(
    //   Next({
    //     dev: process.env.NODE_ENV !== 'production',
    //     dir: clientPath,
    //   }),
    //   {
    //     dev: process.env.NODE_ENV !== 'production',
    //     viewsDir: '',
    //   },
    // ),
    // ServeStaticModule.forRoot({
    //   rootPath: path.join(clientPath, 'public'),
    // }),
    CommonModule,
    AuthModule,
    UserModule,
    GameModule,
    ContestModule,
    CloudinaryModule,
  ],
  controllers: [], //[AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RedirectAuthenticatedMiddleware).forRoutes(AppController);
  // }
}
