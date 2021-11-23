export interface PaginationOptions {
  page?: number;
  perPage?: number;
}
export interface IMongoosePaginationService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  getPaginationPipeline(options?: PaginationOptions): object[];
}
