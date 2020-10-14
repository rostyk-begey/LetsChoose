import cloudinary, { UploadApiResponse } from 'cloudinary';

export default class CloudinaryService {
  public static upload(
    filePath: string,
    publicId: string,
  ): Promise<UploadApiResponse> {
    return cloudinary.v2.uploader.upload(filePath, {
      public_id: publicId,
    });
  }

  public static destroy(publicId: string): Promise<any> {
    return cloudinary.v2.uploader.destroy(publicId);
  }
}
