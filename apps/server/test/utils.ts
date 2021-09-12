import { CommonModule } from '@modules/common/common.module';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import config from '@src/config';

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
      ...meta.imports,
    ],
    exports: [ConfigModule, ...meta.exports],
  });
};
