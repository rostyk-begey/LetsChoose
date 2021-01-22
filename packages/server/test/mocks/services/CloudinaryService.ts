import { UploadApiResponse } from 'cloudinary';

import { ICloudinaryService } from '../../../src/abstract/cloudinary.service.interface';

const CloudinaryService: ICloudinaryService = {
  upload: (filePath: string, publicId: string): Promise<UploadApiResponse> =>
    Promise.resolve({
      public_id: publicId,
      version: 0,
      signature: '',
      width: 0,
      height: 0,
      format: '',
      resource_type: '',
      created_at: '',
      tags: [],
      pages: 0,
      bytes: 0,
      type: '',
      etag: '',
      placeholder: true,
      url: '',
      secure_url: publicId,
      access_mode: '',
      original_filename: '',
      moderation: [],
      access_control: [],
      context: {},
      metadata: {},
    }),

  destroy: () => Promise.resolve(),
};

CloudinaryService.upload = jest.fn(CloudinaryService.upload);
CloudinaryService.destroy = jest.fn(CloudinaryService.destroy);

export default CloudinaryService;
