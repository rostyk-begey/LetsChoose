import { Injectable } from '@nestjs/common';
import cloudinary, { UploadApiResponse } from 'cloudinary';

import { ICloudinaryService } from '../../abstract/cloudinary.service.interface';

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  public upload(
    filePath: string,
    publicId: string,
  ): Promise<UploadApiResponse> {
    return cloudinary.v2.uploader.upload(filePath, {
      public_id: publicId,
    });
  }

  public destroy(publicId: string): Promise<any> {
    return cloudinary.v2.uploader.destroy(publicId);
  }
}
