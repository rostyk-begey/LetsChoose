import { IContestItemRepository } from '@lets-choose/api/abstract';
import {
  getPaginationPipelines,
  getSearchPipelines,
} from '@lets-choose/api/common/utils';
import {
  ContestItemDto,
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
  ISortOptions,
} from '@lets-choose/common/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    const result = await this.contestItemModel
      .aggregate<GetItemsResponse>(pipeline)
      .exec();
    return result[0];
  }

  public async findById(itemId: string): Promise<ContestItemDto> {
    const contestItem = await this.contestItemModel.findById(itemId).exec();
    if (!contestItem) {
      throw new NotFoundException('Contest not found');
    }
    return contestItem.toObject();
  }

  public async findByContestId(contestId: string): Promise<ContestItemDto[]> {
    const res = await this.contestItemModel.find({ contestId }).exec();
    return res.map((doc) => doc.toObject());
  }

  public async findByIdAndUpdate(
    itemId: string,
    data: Partial<ContestItem>,
  ): Promise<ContestItemDto> {
    const contestItem = await this.contestItemModel
      .findByIdAndUpdate(itemId, data)
      .exec();
    console.log(contestItem);
    if (!contestItem) {
      throw new NotFoundException('Contest not found');
    }
    return contestItem.toObject();
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
    data: Omit<CreateContestItemDto, 'id'>,
  ): Promise<ContestItemDto> {
    const contestItem = new this.contestItemModel(data);
    await contestItem.save();
    return contestItem.toObject();
  }
}
