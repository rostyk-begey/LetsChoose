import { injectable } from 'inversify';
import { Types } from 'mongoose';
import chunk from 'lodash/chunk';

import {
  CreateContestItemData,
  IContestItemRepository,
} from '../../../repositories/ContestItemRepository';
import contestItems, { ExtendedContestItem } from './data/contestItems';
import { ContestItem } from '../../../models/ContestItem';

@injectable()
export default class ContestRepository implements IContestItemRepository {
  private contestItems = contestItems;

  async countDocuments(): Promise<number> {
    return this.contestItems.length;
  }
  async aggregate(aggregations?: any[]): Promise<ContestItem[]> {
    return this.contestItems;
  }
  async findById(contestId: string): Promise<ContestItem> {
    const contestItem = this.contestItems.find(({ id }) => contestId === id);
    if (!contestItem) {
      throw new Error('contest not found');
    }
    return contestItem;
  }
  async findByContestId(contestId: string): Promise<ContestItem[]> {
    return this.contestItems.filter(({ contestId: cId }) => contestId === cId);
  }
  async deleteContestItems(contestId: string): Promise<void> {
    this.contestItems = this.contestItems.filter(
      ({ contestId: cId }) => contestId !== cId,
    );
  }
  async createContestItem(data: CreateContestItemData): Promise<ContestItem> {
    const id = new Types.ObjectId().toString();
    const contest: ExtendedContestItem = {
      // @ts-ignore
      _id: id,
      id: id,
      games: 0,
      compares: 0,
      wins: 0,
      finalWins: 0,
      ...data,
    };
    this.contestItems.push(contest);
    return contest;
  }
}
