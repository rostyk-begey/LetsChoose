import { ApiConfigModule, CloudinaryConfig } from '@lets-choose/api/config';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  const filePath = 'testFilePath';
  const public_id = 'testPublicId';

  beforeEach(async () => {
    jest.spyOn(cloudinary, 'config');
    // const cloudinaryConfig: CloudinaryConfig = {
    //   cloudName: 'cloudName',
    //   apiKey: 'apiKey',
    //   apiSecret: 'apiSecret',
    // };
    // const configServiceGet = jest.fn((a, b) => cloudinaryConfig);
    // const configService: Partial<ConfigService> = {
    //   get: configServiceGet as any,
    // };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        // {
        //   provide: ConfigService,
        //   useValue: configService,
        // },
      ],
      imports: [ApiConfigModule.register({ validateConfig: false })],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
    // configService = module.get<ConfigService>(ConfigService);
    // jest.spyOn(configService, 'get').mockImplementation(() => ({
    //   cloudName: 'cloudName',
    //   apiKey: 'apiKey',
    //   apiSecret: 'apiSecret',
    // }));
  });

  afterAll(() => {
    jest.clearAllMocks();
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
