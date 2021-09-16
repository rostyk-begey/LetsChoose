import { ICloudinaryService } from '@abstract/cloudinary.service.interface';

const cloudinaryService: jest.Mocked<ICloudinaryService> = {
  upload: jest.fn((filePath: string, publicId: string) =>
    Promise.resolve(`${filePath}:${publicId}`),
  ),
  destroy: jest.fn((_) => Promise.resolve()),
  destroyMultiple: jest.fn((_) => Promise.resolve()),
  deleteFolder: jest.fn((_) => Promise.resolve()),
};

export default cloudinaryService;
