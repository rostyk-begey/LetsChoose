export interface ICloudinaryService {
  upload(filePath: string, publicId: string): Promise<string>;
  destroy(publicId: string): Promise<any>;
  destroyMultiple(publicIds: string[]): Promise<any>;
  deleteFolder(folder: string): Promise<any>;
}
