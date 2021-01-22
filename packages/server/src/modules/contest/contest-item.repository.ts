import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateContestItemDto } from '@lets-choose/common';

import { IContestItemRepository } from '../../abstract/contest-item.repository.interface';

import { ContestItem, ContestItemDocument } from './contest-item.schema';

@Injectable()
export class ContestItemRepository implements IContestItemRepository {
  constructor(
    @InjectModel(ContestItem.name)
    private readonly contestItemModel: Model<ContestItemDocument>,
  ) {}

  public async countDocuments(
    criteria?: FilterQuery<ContestItem>,
  ): Promise<number> {
    if (criteria) return this.contestItemModel.countDocuments(criteria);
    const res = await this.contestItemModel.countDocuments();
    return res as number;
  }

  public aggregate(aggregations?: any[]): Promise<ContestItem[]> {
    return this.contestItemModel.aggregate(aggregations).exec();
  }

  public async findById(itemId: string): Promise<ContestItem> {
    const contestItem = await this.contestItemModel.findById(itemId);
    if (!contestItem) {
      throw new NotFoundException('Contest not found');
    }
    return contestItem;
  }

  public async findByContestId(contestId: string): Promise<ContestItem[]> {
    const res = await this.contestItemModel.find({ contestId });
    return res as ContestItem[];
  }

  public async findByIdAndUpdate(
    itemId: string,
    data: Partial<ContestItem>,
  ): Promise<ContestItem> {
    const contestItem = await this.contestItemModel.findByIdAndUpdate(
      itemId,
      data,
    );
    if (!contestItem) {
      throw new NotFoundException('Contest not found');
    }
    return contestItem;
  }

  public async deleteContestItems(contestId: string): Promise<void> {
    await this.contestItemModel.deleteMany({ contestId });
  }

  public async createContestItem(
    data: CreateContestItemDto,
  ): Promise<ContestItem> {
    const contestItem = new this.contestItemModel(data);
    await contestItem.save();
    return contestItem;
  }
}
