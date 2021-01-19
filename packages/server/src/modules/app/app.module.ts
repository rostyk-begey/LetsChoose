import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { ContestModule } from '../contest/contest.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import config from '../../config';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UserModule,
    GameModule,
    ContestModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
