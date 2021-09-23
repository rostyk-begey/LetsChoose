export interface IRepository<
  DtoType,
  CreateDto = DtoType,
  UpdateDto = DtoType,
> {
  count(): Promise<number>;
  all(): Promise<DtoType[]>;
  findById(documentId: string): Promise<DtoType>;
  findByIdAndUpdate(
    documentId: string,
    data: Partial<UpdateDto>,
  ): Promise<DtoType>;
  findByIdAndRemove(documentId: string): Promise<DtoType>;
  create(data: CreateDto): Promise<DtoType>;
}
