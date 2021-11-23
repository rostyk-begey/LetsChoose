import { PaginationQuery, PaginatedResponse } from '@lets-choose/common/dto';

export interface IRepositoryWithPagination<
  DtoType,
  PaginationData extends PaginationQuery = PaginationQuery,
  Response extends PaginatedResponse<DtoType> = PaginatedResponse<DtoType>,
> {
  paginate(data: PaginationData): Promise<Response>;
}
