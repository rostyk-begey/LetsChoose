import {
  AbstractMongooseRepository,
  CreateContestData,
  IContestRepository,
  IMongoosePaginationService,
  IRepositoryWithPagination,
} from '@lets-choose/api/abstract';
import { MongoosePaginationService } from '@lets-choose/api/common/services';
import {
  ContestDto,
  GetContestsQuery,
  GetContestsResponse,
  ISortOptions,
  SORT_OPTIONS,
} from '@lets-choose/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineBuilder } from 'mongodb-pipeline-builder';
import { Meta } from 'mongodb-pipeline-builder/operators';
import { Model, PipelineStage } from 'mongoose';
import { Contest, ContestDocument } from './contest.entity';

@Injectable()
export class ContestRepository
  extends AbstractMongooseRepository<
    ContestDto,
    CreateContestData,
    ContestDto,
    ContestDocument
  >
  implements
    IContestRepository,
    IRepositoryWithPagination<ContestDto, GetContestsQuery>
{
  constructor(
    @InjectModel(Contest.name)
    private readonly contestModel: Model<ContestDocument>,

    @Inject(MongoosePaginationService)
    private readonly mongoosePaginationService: IMongoosePaginationService,
  ) {
    super(contestModel);
  }

  public async countByAuthor(authorId: string): Promise<number> {
    return await this.contestModel.countDocuments({ author: authorId }).exec();
  }

  private getSortStageOptions(
    search: string,
    sortBy: SORT_OPTIONS = SORT_OPTIONS.POPULAR,
  ): ISortOptions {
    const sortOptions: unknown[][] = [];

    if (search) {
      sortOptions.push(['score', -1]);
    }

    if (sortBy === SORT_OPTIONS.POPULAR) {
      sortOptions.unshift([sortBy, -1]);
    } else {
      sortOptions.push([SORT_OPTIONS.NEWEST, -1]);
    }

    return Object.fromEntries(sortOptions);
  }

  private buildPipeline({
    author,
    sortBy,
    search,
    page,
    perPage,
  }: GetContestsQuery) {
    const builder = new PipelineBuilder('contests-pipeline', { debug: true });

    const query = search.trim();

    if (query) {
      builder.Search({
        text: {
          query,
          path: ['title', 'excerpt'],
          fuzzy: {
            maxEdits: 2,
          },
        },
      });

      builder.AddFields({
        score: Meta('searchScore'),
      });
    }

    builder.Lookup({
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
    });

    builder.Unwind('$author');

    if (author) {
      builder.Match({ 'author.username': author });
    }

    const sortField = sortBy ? SORT_OPTIONS[sortBy] : SORT_OPTIONS.POPULAR;
    builder.Sort(this.getSortStageOptions(search, sortField));

    builder.Project({
      _id: 0,
      id: '$_id',
      thumbnail: 1,
      title: 1,
      items: 1,
      excerpt: 1,
      games: 1,
      createdAt: 1,
      'author.avatar': 1,
      'author.username': 1,
    });

    builder.AddFields({
      score: Meta('searchScore'),
    });

    return [
      ...builder.getPipeline(),
      ...this.mongoosePaginationService.getPaginationPipeline({
        page,
        perPage,
      }),
    ] as PipelineStage[];
  }

  public async paginate(query: GetContestsQuery): Promise<GetContestsResponse> {
    const pipeline = this.buildPipeline(query);

    const [result] = await this.contestModel
      .aggregate<GetContestsResponse>(pipeline)
      .exec();

    return result;
  }

  public async findByAuthor(author: string): Promise<ContestDto[]> {
    const contests = await this.contestModel.find({ author }).exec();
    return contests.map(this.toObject);
  }

  public async findByIdAndRemove(contestId: string): Promise<ContestDto> {
    return super.findByIdAndRemove(contestId);
  }
}
