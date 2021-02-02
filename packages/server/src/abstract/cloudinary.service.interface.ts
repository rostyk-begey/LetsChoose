export interface ICloudinaryService {
  upload(filePath: string, publicId: string): Promise<string>;
  destroy(publicId: string): Promise<any>;
}
