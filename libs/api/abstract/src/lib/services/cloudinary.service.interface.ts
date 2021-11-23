export interface ICloudinaryService {
  upload(filePath: string, publicId: string): Promise<string>;
  destroy(publicId: string): Promise<unknown>;
  destroyMultiple(publicIds: string[]): Promise<unknown>;
  deleteFolder(folder: string): Promise<unknown>;
}
