import { UploadApiResponse } from 'cloudinary';
import { injectable } from 'inversify';

import { ICloudinaryService } from '../../../services/CloudinaryService';

@injectable()
export default class CloudinaryService implements ICloudinaryService {
  public async upload(
    filePath: string,
    publicId: string,
  ): Promise<UploadApiResponse> {
    return {
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
    };
  }

  public async destroy(): Promise<any> {
    return null;
  }
}
