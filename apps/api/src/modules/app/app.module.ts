import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContestModule } from '@modules/contest/contest.module';
import { CloudinaryModule } from '@modules/cloudinary/cloudinary.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CommonModule } from '@modules/common/common.module';
import { UserModule } from '@modules/user/user.module';
import { GameModule } from '@modules/game/game.module';
import config from '@src/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const options: MongooseModuleOptions = {
          uri: configService.get<string>('mongoUri'),
        };

        if (configService.get<string>('NODE_ENV') === 'test') {
          options.retryAttempts = 0;
        }

        return options;
      },
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
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
