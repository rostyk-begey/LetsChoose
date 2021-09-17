import { loadConfig as config } from '@lets-choose/api/config';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  const filePath = 'testFilePath';
  const public_id = 'testPublicId';

  beforeEach(async () => {
    jest.spyOn(cloudinary, 'config');
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [config],
        }),
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  test('configure connection', () => {
    expect(cloudinary.config).toBeCalledTimes(1);
  });

  test('upload', async () => {
    jest
      .spyOn(cloudinary.uploader, 'upload')
      .mockImplementation(() => Promise.resolve({}) as Promise<any>);

    await service.upload(filePath, public_id);

    expect(cloudinary.uploader.upload).toBeCalledWith(filePath, { public_id });
  });

  test('destroy', async () => {
    jest
      .spyOn(cloudinary.uploader, 'destroy')
      .mockImplementation(() => Promise.resolve());

    await service.destroy(public_id);

    expect(cloudinary.uploader.destroy).toBeCalledWith(public_id);
  });
});
