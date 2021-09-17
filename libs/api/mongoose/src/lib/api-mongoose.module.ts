import { Config } from '@lets-choose/api/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<Config>) => {
        const options: MongooseModuleOptions = {
          uri: configService.get('mongoUri', { infer: true }),
        };

        if (configService.get('environment', { infer: true }) === 'test') {
          options.retryAttempts = 0;
        }

        return options;
      },
      inject: [ConfigService],
    }),
  ],
})
export class ApiMongooseModule {}
