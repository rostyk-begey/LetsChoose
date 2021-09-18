import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { loadConfig } from './config';
import { configValidationSchema } from './config.validation';

export interface ApiConfigModuleOptions {
  validateConfig?: boolean;
}

@Global()
@Module({})
export class ApiConfigModule {
  static register({
    validateConfig = true,
  }: ApiConfigModuleOptions): DynamicModule {
    let options: ConfigModuleOptions = {
      isGlobal: true,
      load: [loadConfig],
    };

    if (validateConfig) {
      options = {
        ...options,
        validationSchema: configValidationSchema,
        validationOptions: {
          allowUnknown: true,
          abortEarly: false,
        },
      };
    }

    const configModule = ConfigModule.forRoot(options);

    return {
      module: ConfigModule,
      global: true,
      imports: [configModule],
      exports: [configModule],
    };
  }
}
