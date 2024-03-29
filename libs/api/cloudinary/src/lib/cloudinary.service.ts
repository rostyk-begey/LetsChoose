import { ICloudinaryService } from '@lets-choose/api/abstract';
import { Config } from '@lets-choose/api/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor(configService: ConfigService<Config>) {
    const { cloudName, apiKey, apiSecret } = configService.get('cloudinary', {
      infer: true,
    });
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  public async upload(filePath: string, publicId: string): Promise<string> {
    try {
      const { secure_url } = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
      });
      return secure_url;
    } catch (e) {
      return '';
    }
  }

  public destroy(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  public destroyMultiple(publicIds: string[]): Promise<any> {
    return cloudinary.api.delete_resources(publicIds);
  }

  public deleteFolder(folder: string): Promise<any> {
    return cloudinary.api.delete_folder(folder);
  }
}
