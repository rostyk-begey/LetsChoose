import { ICloudinaryService } from '@lets-choose/api/abstract';

const cloudinaryService: jest.Mocked<ICloudinaryService> = {
  upload: jest.fn((filePath: string, publicId: string) =>
    Promise.resolve(`${filePath}:${publicId}`),
  ),
  destroy: jest.fn((_) => Promise.resolve()),
  destroyMultiple: jest.fn((_) => Promise.resolve()),
  deleteFolder: jest.fn((_) => Promise.resolve()),
};

export default cloudinaryService;
