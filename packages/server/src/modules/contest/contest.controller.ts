import {
  Contest,
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  HttpResponseMessageDto,
} from '@lets-choose/common';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IContestService } from '../../abstract/contest.service.interface';
import { TYPES } from '../../injectable.types';
import { JoiValidationPipe } from '../../pipes/JoiValidationPipe';
import { fieldNameFilter, unlinkAsync } from '../../usecases/utils';
import { ContestItem } from './contest-item.schema';
import { getContestItemsSchema, getContestSchema } from './contest.validation';

@ApiTags('Contest')
@Controller('/api/contests')
export class ContestController {
  constructor(
    @Inject(TYPES.ContestService)
    private readonly contestService: IContestService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all contests' })
  @ApiResponse({
    status: 200,
    type: GetContestsResponse,
    content: { test: { example: 'testx' } },
  })
  @UsePipes(new JoiValidationPipe(getContestSchema, 'query'))
  public async get(
    @Query() query: GetContestQuery,
  ): Promise<GetContestsResponse> {
    return await this.contestService.getContestsPaginate(query);
  }

  @Get('/:contestId')
  public async find(@Param('contestId') contestId: string): Promise<Contest> {
    return await this.contestService.findContestById(contestId);
  }

  @Get('/:contestId/items')
  @UsePipes(new JoiValidationPipe(getContestItemsSchema, 'query'))
  public async getItems(
    @Param('contestId') contestId: string,
    @Query() query: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    return await this.contestService.getContestItemsPaginate(contestId, query);
  }

  // TODO: add schema validation
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  public async create(
    @Body('title') title: string,
    @Body('excerpt') excerpt: string,
    @Body('items') items: Pick<ContestItem, 'title'>[],
    @UploadedFiles() files,
    @Req() { user }: any,
  ): Promise<Contest> {
    const contest = await this.contestService.createContest(user.id, {
      title,
      excerpt,
      items,
      files,
    });
    const thumbnail = files.find(fieldNameFilter('thumbnail'));
    await unlinkAsync(thumbnail.path);

    const deletingFiles = items.map(
      async (_, i): Promise<void> => {
        const image = files.find(fieldNameFilter(`items[${i}][image]`));
        await unlinkAsync(image.path);
      },
    );

    await Promise.all(deletingFiles);

    return contest;
  }

  // TODO: add schema validation
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('files'))
  @Post('/:contestId')
  public async update(
    @Param('contestId') contestId: string,
    @Body('title') title: string,
    @Body('excerpt') excerpt: string,
    @UploadedFiles() files,
  ): Promise<HttpResponseMessageDto> {
    await this.contestService.updateContest(contestId, {
      title,
      excerpt,
      files,
    });

    return { message: 'Contest successfully updated!' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:contestId/reset')
  public async reset(
    @Param('contestId') contestId: string,
    @Req() { user }: any,
  ): Promise<Contest> {
    const { author } = await this.contestService.findContestById(contestId);
    if (author.toString() !== user.id.toString()) {
      throw new ForbiddenException();
    }
    return await this.contestService.resetContest(contestId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:contestId')
  public async remove(
    @Param('contestId') contestId: string,
    @Req() { user }: any,
  ): Promise<HttpResponseMessageDto> {
    const { author } = await this.contestService.findContestById(contestId);
    if (author.toString() !== user.id.toString()) {
      throw new ForbiddenException();
    }
    await this.contestService.removeContest(contestId);

    return { message: 'Contest successfully deleted!' };
  }
}
