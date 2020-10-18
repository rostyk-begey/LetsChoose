import { DocumentQuery, FilterQuery, Query } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';

import { ContestItem, ContestItemModel } from '../models/ContestItem';
import { AppError } from '../usecases/error';

export type CreateContestData = Omit<
  ContestItem,
  'id' | 'games' | 'compares' | 'wins' | 'finalWins'
>;

export interface IContestItemRepository {
  countDocuments(criteria?: FilterQuery<ContestItem>): Promise<number>;
  aggregate(aggregations?: any[]): Promise<ContestItem[]>;
  findById(itemId: string): Promise<ContestItem>;
  findByContestId(contestId: string): Promise<ContestItem[]>;
  findByIdAndUpdate(
    itemId: string,
    data: Partial<ContestItem>,
  ): Promise<ContestItem>;
  deleteContestItems(itemId: string): Promise<void>;
  createContestItem(data: CreateContestData): Promise<ContestItem>;
}

export default class ContestItemRepository implements IContestItemRepository {
  public async countDocuments(
    criteria?: FilterQuery<ContestItem>,
  ): Promise<number> {
    if (criteria) return ContestItemModel.countDocuments(criteria);
    const res = await ContestItemModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<ContestItem[]> {
    return ContestItemModel.aggregate(aggregations).exec();
  }

  public async findById(itemId: string): Promise<ContestItem> {
    const contestItem = await ContestItemModel.findById(itemId);
    if (!contestItem) {
      throw new AppError('Contest not found', 404);
    }
    return contestItem;
  }

  public async findByContestId(contestId: string): Promise<ContestItem[]> {
    const res = await ContestItemModel.find({ contestId });
    return res as ContestItem[];
  }

  public async findByIdAndUpdate(
    itemId: string,
    data: Partial<ContestItem>,
  ): Promise<ContestItem> {
    const contestItem = await ContestItemModel.findByIdAndUpdate(itemId, data);
    if (!contestItem) {
      throw new AppError('Contest not found', 404);
    }
    return contestItem;
  }

  public async deleteContestItems(itemId: string): Promise<void> {
    await ContestItemModel.deleteMany({ itemId });
  }

  public async createContestItem(
    data: CreateContestData,
  ): Promise<ContestItem> {
    const contestItem = new ContestItemModel(data);
    await contestItem.save();
    return contestItem;
  }
}
