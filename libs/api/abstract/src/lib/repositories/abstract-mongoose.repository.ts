import { NotFoundException } from '@nestjs/common';
import { Model, Types, Document } from 'mongoose';
import { IRepository } from './repository.interface';

type DocType<T> = T & { _id: any } & Document<Types.ObjectId>;

export abstract class AbstractMongooseRepository<
  DtoType,
  CreateDto = DtoType,
  UpdateDto = DtoType,
  DocumentType extends DocType<DtoType> = DocType<DtoType>,
> implements IRepository<DtoType, CreateDto, UpdateDto>
{
  protected constructor(protected readonly model: Model<DocumentType>) {}

  protected toObject(document: DocumentType): DtoType {
    return document.toObject<DtoType>();
  }

  protected checkIfExistsAndTransformToDocument(
    document: DocumentType | null,
  ): DtoType {
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return this.toObject(document);
  }

  public count(): Promise<number> {
    return this.model.countDocuments().exec();
  }

  public async all(): Promise<DtoType[]> {
    const document = await this.model.find().exec();
    return document.map(this.toObject) as DtoType[];
  }

  public async findById(documentId: string): Promise<DtoType> {
    const document = await this.model.findById(documentId).exec();
    return this.checkIfExistsAndTransformToDocument(document);
  }

  public async findByIdAndUpdate(
    documentId: string,
    data: Partial<UpdateDto>,
  ): Promise<DtoType> {
    const document = await this.model
      .findByIdAndUpdate(documentId, {
        $set: data,
      } as any)
      .exec();

    return this.checkIfExistsAndTransformToDocument(document);
  }

  public async findByIdAndRemove(documentId: string): Promise<DtoType> {
    const document = await this.model.findByIdAndRemove(documentId).exec();
    return this.checkIfExistsAndTransformToDocument(document);
  }

  public async create(data: CreateDto): Promise<DtoType> {
    const id = new Types.ObjectId();
    const document = new this.model({ _id: id, ...data });

    await document.save();

    return this.toObject(document);
  }
}
