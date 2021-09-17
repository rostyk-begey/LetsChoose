import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { Config } from '@lets-choose/api/config';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { loadConfig as config } from '@lets-choose/api/config';

export const createTestingModule = (
  metadata: ModuleMetadata,
): TestingModuleBuilder => {
  const meta: ModuleMetadata = {
    imports: [],
    exports: [],
    controllers: [],
    providers: [],
    ...metadata,
  };

  return Test.createTestingModule({
    ...meta,
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        load: [config],
      }),
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
      ApiCommonServicesModule,
      ...meta.imports,
    ],
    exports: [ConfigModule, ...meta.exports],
  });
};
