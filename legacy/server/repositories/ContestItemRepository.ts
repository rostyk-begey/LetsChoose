import { FilterQuery } from 'mongoose';
import { injectable } from 'inversify';

import { ContestItem, ContestItemModel } from '../models/ContestItem';
import { AppError } from '../usecases/error';

export type CreateContestItemData = Omit<
  ContestItem,
  'id' | 'games' | 'compares' | 'wins' | 'finalWins'
>;

export interface IContestItemRepository {
  countDocuments(criteria?: FilterQuery<ContestItem>): Promise<number>;
  aggregate(aggregations?: any[]): Promise<ContestItem[]>;
  findById(itemId: string): Promise<ContestItem>;
  findByContestId(contestId: string): Promise<ContestItem[]>;
  deleteContestItems(contestId: string): Promise<void>;
  createContestItem(data: CreateContestItemData): Promise<ContestItem>;
}

@injectable()
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

  public async deleteContestItems(contestId: string): Promise<void> {
    await ContestItemModel.deleteMany({ contestId });
  }

  public async createContestItem(
    data: CreateContestItemData,
  ): Promise<ContestItem> {
    const contestItem = new ContestItemModel(data);
    await contestItem.save();
    return contestItem;
  }
}
