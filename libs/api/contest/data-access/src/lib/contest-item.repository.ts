import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import {
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
  ISortOptions,
} from '@lets-choose/common/dto';

import { IContestItemRepository } from '@abstract/contest-item.repository.interface';
import { getPaginationPipelines, getSearchPipelines } from '@usecases/utils';
import { ContestItem, ContestItemDocument } from './contest-item.entity';

interface SortOptions {
  rankScore: number;
  score?: number;
}

interface SortPipeline {
  $sort: ISortOptions;
}

@Injectable()
export class ContestItemRepository implements IContestItemRepository {
  constructor(
    @InjectModel(ContestItem.name)
    private readonly contestItemModel: Model<ContestItemDocument>,
  ) {}

  public async countDocuments(contestId?: string): Promise<number> {
    if (contestId) {
      return this.contestItemModel.countDocuments({ contestId });
    }
    return this.contestItemModel.countDocuments();
  }

  protected static getSortPipeline(search: string): SortPipeline {
    const sortOptions: SortOptions = { rankScore: -1 };
    if (search) {
      sortOptions.score = -1;
    }

    return { $sort: sortOptions };
  }

  public async paginate(
    contestId: string,
    { search, page, perPage }: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    const pipeline = [
      ...getSearchPipelines(search), // should be a first stage
      { $match: { contestId: new Types.ObjectId(contestId) } },
      {
        $project: {
          _id: 1,
          id: '$_id',
          title: 1,
          image: 1,
          compares: 1,
          contestId: 1,
          wins: 1,
          games: 1,
          finalWins: 1,
          winRate: {
            $cond: {
              if: { $gt: ['$compares', 0] },
              then: { $divide: ['$wins', '$compares'] },
              else: 0,
            },
          },
          finalWinRate: {
            $cond: {
              if: { $gt: ['$games', 0] },
              then: { $divide: ['$finalWins', '$games'] },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          rankScore: {
            $add: ['$winRate', '$finalWinRate'],
          },
        },
      },
      ContestItemRepository.getSortPipeline(search),
      ...getPaginationPipelines(page, perPage),
    ];
    const result = await this.contestItemModel.aggregate(pipeline).exec();
    return result[0];
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

  public async updateContestItems(
    contestId: string,
    data: Partial<ContestItem>,
  ): Promise<void> {
    await this.contestItemModel.updateMany({ contestId }, data);
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
