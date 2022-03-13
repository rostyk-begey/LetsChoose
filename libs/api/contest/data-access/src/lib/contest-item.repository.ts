import {
  AbstractMongooseRepository,
  IContestItemRepository,
  IMongoosePaginationService,
  IRepositoryWithPagination,
} from '@lets-choose/api/abstract';
import { MongoosePaginationService } from '@lets-choose/api/common/services';
import {
  ContestItemDto,
  CreateContestItemDto,
  GetItemsQuery,
  GetItemsResponse,
  ISortOptions,
} from '@lets-choose/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineBuilder } from 'mongodb-pipeline-builder';
import { Add, GreaterThan, Meta } from 'mongodb-pipeline-builder/operators';
import { Model, PipelineStage, Types } from 'mongoose';
import { ContestItem, ContestItemDocument } from './contest-item.entity';

interface SortOptions {
  rankScore: number;
  score?: number;
}

interface SortPipeline {
  $sort: ISortOptions;
}

@Injectable()
export class ContestItemRepository
  extends AbstractMongooseRepository<ContestItemDto, CreateContestItemDto>
  implements
    IContestItemRepository,
    IRepositoryWithPagination<
      ContestItemDto,
      GetItemsQuery & { contestId: string }
    >
{
  constructor(
    @InjectModel(ContestItem.name)
    private readonly contestItemModel: Model<ContestItemDocument>,

    @Inject(MongoosePaginationService)
    private readonly mongoosePaginationService: IMongoosePaginationService,
  ) {
    super(contestItemModel);
  }

  public async countDocuments(contestId?: string): Promise<number> {
    if (contestId) {
      return this.contestItemModel.countDocuments({ contestId });
    }
    return this.count();
  }

  protected getSortPipeline(search: string): SortPipeline {
    const sortOptions: SortOptions = { rankScore: -1 };
    if (search) {
      sortOptions.score = -1;
    }

    return { $sort: sortOptions };
  }

  private getSortStageOptions(search: string): SortOptions {
    const sortOptions: SortOptions = { rankScore: -1 };
    if (search) {
      sortOptions.score = -1;
    }

    return sortOptions;
  }

  private buildPipeline({
    contestId,
    search,
    page,
    perPage,
  }: GetItemsQuery & { contestId: string }) {
    const builder = new PipelineBuilder('contest-items-pipeline', {
      debug: true,
    });

    const query = search.trim();

    if (query) {
      builder.Search({
        text: {
          query,
          path: ['title'],
          fuzzy: {
            maxEdits: 2,
          },
        },
      });

      builder.AddFields({
        score: Meta('searchScore'),
      });
    }

    builder.Match({ contestId: new Types.ObjectId(contestId) });

    builder.Project({
      _id: 0,
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
          if: GreaterThan('$compares', 0),
          then: { $divide: ['$wins', '$compares'] },
          else: 0,
        },
      },
      finalWinRate: {
        $cond: {
          if: GreaterThan('$games', 0),
          then: { $divide: ['$finalWins', '$games'] },
          else: 0,
        },
      },
    });

    builder.AddFields({
      rankScore: Add('$winRate', '$finalWinRate'),
    });

    builder.Sort(this.getSortStageOptions(search));

    return [
      ...builder.getPipeline(),
      ...this.mongoosePaginationService.getPaginationPipeline({
        page,
        perPage,
      }),
    ] as PipelineStage[];
  }

  public async paginate(
    query: GetItemsQuery & { contestId: string },
  ): Promise<GetItemsResponse> {
    const pipeline = this.buildPipeline(query);

    const [result] = await this.contestItemModel
      .aggregate<GetItemsResponse>(pipeline)
      .exec();

    return result;
  }

  public async findByContestId(contestId: string): Promise<ContestItemDto[]> {
    const res = await this.contestItemModel.find({ contestId }).exec();
    return res.map(this.toObject);
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
}
