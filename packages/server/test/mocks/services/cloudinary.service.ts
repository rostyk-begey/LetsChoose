import { ICloudinaryService } from '../../../src/abstract/cloudinary.service.interface';

const CloudinaryService: ICloudinaryService = {
  upload: (filePath: string, publicId: string): Promise<string> =>
    Promise.resolve(`${filePath}${publicId}`),

  destroy: () => Promise.resolve(),
};

CloudinaryService.upload = jest.fn(CloudinaryService.upload);
CloudinaryService.destroy = jest.fn(CloudinaryService.destroy);

export default CloudinaryService;
