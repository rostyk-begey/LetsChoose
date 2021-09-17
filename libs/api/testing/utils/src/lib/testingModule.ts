import { ApiCommonServicesModule } from '@lets-choose/api/common/services';
import { ApiConfigModule } from '@lets-choose/api/config';
import { ApiMongooseModule } from '@lets-choose/api/mongoose';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { Test } from '@nestjs/testing';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';

export const createTestingModule = (
  metadata: Partial<ModuleMetadata>,
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
      ApiConfigModule,
      ApiMongooseModule,
      ApiCommonServicesModule,
      ...meta.imports,
    ],
  });
};
