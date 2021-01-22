import { UploadApiResponse } from 'cloudinary';

export interface ICloudinaryService {
  upload(filePath: string, publicId: string): Promise<UploadApiResponse>;
  destroy(publicId: string): Promise<any>;
}
