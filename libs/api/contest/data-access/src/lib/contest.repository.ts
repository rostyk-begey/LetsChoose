import {
  CreateContestData,
  IContestRepository,
} from '@lets-choose/api/abstract';
import {
  getPaginationPipelines,
  getSearchPipelines,
} from '@lets-choose/api/common/utils';
import {
  ContestDto,
  GetContestsQuery,
  GetContestsResponse,
  ISortOptions,
  SORT_OPTIONS,
} from '@lets-choose/common/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest, ContestDocument } from './contest.entity';

@Injectable()
export class ContestRepository implements IContestRepository {
  constructor(
    @InjectModel(Contest.name)
    private readonly contestModel: Model<ContestDocument>,
  ) {}

  public async countDocuments(authorId?: string): Promise<number> {
    return authorId
      ? await this.contestModel.countDocuments({ author: authorId }).exec()
      : await this.contestModel.countDocuments().exec();
  }

  protected static getSortPipeline(
    search: string,
    sortBy: SORT_OPTIONS = SORT_OPTIONS.POPULAR,
  ): { $sort: ISortOptions } {
    const sortOptions: unknown[][] = [];

    if (search) {
      sortOptions.push(['score', -1]);
    }

    if (sortBy === SORT_OPTIONS.POPULAR) {
      sortOptions.unshift([sortBy, -1]);
    } else {
      sortOptions.push([SORT_OPTIONS.NEWEST, -1]);
    }

    return { $sort: Object.fromEntries(sortOptions) };
  }

  public async paginate({
    author,
    sortBy,
    search,
    page,
    perPage,
  }: GetContestsQuery): Promise<GetContestsResponse> {
    const getMatchPipeline = () => {
      return author ? [{ $match: { 'author.username': author } }] : [];
    };

    const query = [
      ...getSearchPipelines(search), // should be a first stage
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      ...getMatchPipeline(),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ContestRepository.getSortPipeline(search, SORT_OPTIONS[sortBy]),
      {
        $project: {
          _id: 1,
          id: '$_id',
          thumbnail: 1,
          title: 1,
          items: 1,
          excerpt: 1,
          games: 1,
          createdAt: 1,
          'author.avatar': 1,
          'author.username': 1,
        },
      },
      {
        $addFields: {
          items: [],
        },
      },
      ...getPaginationPipelines(page, perPage),
    ];

    const result = await this.contestModel
      .aggregate<GetContestsResponse>(query)
      .exec();
    return result[0];
  }

  public async findById(contestId: string): Promise<ContestDto> {
    const contest = await this.contestModel.findById(contestId).exec();
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest.toObject();
  }

  public async findByAuthor(author: string): Promise<ContestDto[]> {
    const contests = await this.contestModel.find({ author }).exec();
    if (!contests) {
      throw new NotFoundException('Contest not found');
    }
    return contests.map((doc) => doc.toObject());
  }

  public async findByIdAndUpdate(
    contestId: string,
    data: Partial<ContestDto>,
  ): Promise<ContestDto> {
    const contest = await this.contestModel
      .findByIdAndUpdate(contestId, {
        $set: data,
      })
      .exec();
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest.toObject();
  }

  public async deleteContest(contestId: string): Promise<ContestDto> {
    const contest = await this.contestModel.findByIdAndRemove(contestId).exec();
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest.toObject();
  }

  public async createContest(data: CreateContestData): Promise<ContestDto> {
    const contest = new this.contestModel(data);
    await contest.save();
    return contest.toObject();
  }
}
