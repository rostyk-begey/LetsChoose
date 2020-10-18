import cloudinary, { UploadApiResponse } from 'cloudinary';

export interface ICloudinaryService {
  upload(filePath: string, publicId: string): Promise<UploadApiResponse>;
  destroy(publicId: string): Promise<any>;
}

export default class CloudinaryService implements ICloudinaryService {
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
