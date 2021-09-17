import {
  ICloudinaryService,
  IContestItemRepository,
  IContestRepository,
  IContestService,
  IGameRepository,
  IUserRepository,
} from '@lets-choose/api/abstract';
import { CloudinaryService } from '@lets-choose/api/cloudinary';
import { fieldNameFilter } from '@lets-choose/api/common/utils';
import {
  ContestItemRepository,
  ContestRepository,
} from '@lets-choose/api/contest/data-access';
import { GameRepository } from '@lets-choose/api/game/data-access';
import { UserRepository } from '@lets-choose/api/user/data-access';
import {
  ContestDto,
  CreateContestDto,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common/dto';
import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

export interface CreateContestsData extends CreateContestDto {
  files: Express.Multer.File[];
}

@Injectable()
export class ContestService implements IContestService {
  constructor(
    @Inject(ContestRepository)
    protected readonly contestRepository: IContestRepository,

    @Inject(ContestItemRepository)
    protected readonly contestItemRepository: IContestItemRepository,

    @Inject(GameRepository)
    protected readonly gameRepository: IGameRepository,

    @Inject(CloudinaryService)
    protected readonly cloudinaryService: ICloudinaryService,

    @Inject(UserRepository)
    protected readonly userRepository: IUserRepository,
  ) {}

  protected static getContestThumbnailPublicId(contestId: string): string {
    return `contests/${contestId}/thumbnail`;
  }

  protected static getContestItemImagePublicId(
    contestId: string,
    contestItemId: string,
  ): string {
    return `contests/${contestId}/items/${contestItemId}`;
  }

  public async getContestsPaginate({
    page = 1,
    perPage = 10,
    search = '',
    sortBy = 'POPULAR',
    author: authorUsername = '',
  }: GetContestsQuery): Promise<GetContestsResponse> {
    const author = await this.userRepository.findByUsername(authorUsername);

    return await this.contestRepository.paginate({
      page,
      perPage,
      search,
      sortBy,
      ...(author && { author: authorUsername }),
    });
  }

  public findContestById(id: string): Promise<ContestDto> {
    return this.contestRepository.findById(id);
  }

  public findContestsByAuthor(author: string): Promise<ContestDto[]> {
    return this.contestRepository.findByAuthor(author);
  }

  public async getContestItemsPaginate(
    contestId: string,
    { page = 1, perPage = 10, search = '' }: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    await this.findContestById(contestId);

    return await this.contestItemRepository.paginate(contestId, {
      page,
      perPage,
      search,
    });
  }

  public async createContest(
    userId: string,
    { files, title, excerpt = '', items }: CreateContestsData,
  ): Promise<ContestDto> {
    const thumbnail = files.find(fieldNameFilter('thumbnail'));

    const contestId = new mongoose.Types.ObjectId();

    const thumbnailUrl = await this.cloudinaryService.upload(
      thumbnail.path,
      ContestService.getContestThumbnailPublicId(contestId.toString()),
    );

    const contest = await this.contestRepository.createContest({
      _id: `${contestId}`,
      thumbnail: thumbnailUrl,
      title,
      excerpt,
      author: userId,
    });

    const savingItems = items.map(async ({ title }, i): Promise<void> => {
      const contestItemId = new mongoose.Types.ObjectId();
      const image = files.find(fieldNameFilter(`items[${i}][image]`));
      const imageUrl = await this.cloudinaryService.upload(
        image.path,
        ContestService.getContestItemImagePublicId(
          contestId.toString(),
          contestItemId.toString(),
        ),
      );
      await this.contestItemRepository.createContestItem({
        title,
        image: imageUrl,
        _id: `${contestItemId}`,
        contestId: `${contestId}`,
      });
    });

    await Promise.all(savingItems);

    return { ...contest, id: `${contestId}` };
  }

  public async updateContest(
    contestId: string,
    { files, title, excerpt }: Omit<CreateContestsData, 'items'>,
  ): Promise<ContestDto> {
    const data: Partial<ContestDto> = {};

    if (title) {
      data.title = title;
    }

    data.excerpt = excerpt;

    if (files?.length) {
      const thumbnailFile = files.find(fieldNameFilter('thumbnail'));
      if (data.thumbnail) {
        await this.cloudinaryService.destroy(
          ContestService.getContestThumbnailPublicId(contestId),
        );
      }
      data.thumbnail = await this.cloudinaryService.upload(
        thumbnailFile.path,
        ContestService.getContestThumbnailPublicId(contestId),
      );
    }

    return this.contestRepository.findByIdAndUpdate(contestId, data);
  }

  public async resetContest(contestId: string): Promise<ContestDto> {
    const contest = await this.contestRepository.findByIdAndUpdate(contestId, {
      games: 0,
    });

    await this.contestItemRepository.updateContestItems(contestId, {
      games: 0,
      compares: 0,
      wins: 0,
      finalWins: 0,
    });

    await this.gameRepository.deleteGames(contestId);

    return contest;
  }

  public async removeContest(contestId: string): Promise<void> {
    await this.contestRepository.deleteContest(contestId);
    await this.cloudinaryService.destroy(
      ContestService.getContestThumbnailPublicId(contestId),
    );
    const items = await this.contestItemRepository.findByContestId(contestId);
    const itemsToDelete = items.map(({ id }) =>
      ContestService.getContestItemImagePublicId(contestId, id),
    );
    await this.cloudinaryService.destroyMultiple(itemsToDelete);
    await this.cloudinaryService.deleteFolder(`contests/${contestId}`);
    await this.contestItemRepository.deleteContestItems(contestId);
  }
}
