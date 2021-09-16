import {
  ContestDto,
  CreateContestDTO,
  GetContestsQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
  HttpResponseMessageDto,
  UpdateContestData,
} from '@lets-choose/common/dto';
import { API_ROUTES } from '@lets-choose/common/utils';
import { ContestService } from '@modules/contest/contest.service';
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
import { IContestService } from '@lets-choose/api/abstract';
import { JoiValidationPipe } from '@lets-choose/api/common/pipes';
import { fieldNameFilter, unlinkAsync } from '@usecases/utils';
import {
  getContestItemsSchema,
  getContestSchema,
  contestIdSchema,
} from '@modules/contest/contest.validation';

@ApiTags('Contest')
@Controller(API_ROUTES.CONTESTS)
export class ContestController {
  constructor(
    @Inject(ContestService)
    private readonly contestService: IContestService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all contests' })
  @ApiResponse({
    status: 200,
    type: GetContestsResponse,
  })
  @UsePipes(new JoiValidationPipe(getContestSchema, 'query'))
  public async get(
    @Query() query: GetContestsQuery,
  ): Promise<GetContestsResponse> {
    return await this.contestService.getContestsPaginate(query);
  }

  @Get('/:contestId')
  @ApiOperation({ summary: 'Find contest by id' })
  @ApiResponse({
    status: 200,
    type: ContestDto,
  })
  @UsePipes(new JoiValidationPipe(contestIdSchema, 'param'))
  public async find(
    @Param('contestId') contestId: string,
  ): Promise<ContestDto> {
    return await this.contestService.findContestById(contestId);
  }

  @Get('/:contestId/items')
  @ApiOperation({ summary: 'Get contest items' })
  @ApiResponse({
    status: 200,
    type: GetItemsResponse,
  })
  @UsePipes(new JoiValidationPipe(contestIdSchema, 'param'))
  @UsePipes(new JoiValidationPipe(getContestItemsSchema, 'query'))
  public async getItems(
    @Param('contestId') contestId: string,
    @Query() query: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    return await this.contestService.getContestItemsPaginate(contestId, query);
  }

  // TODO: add schema validation
  @Post('/')
  @ApiOperation({ summary: 'Create new contest' })
  @ApiResponse({
    status: 200,
    type: ContestDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  public async create(
    @Body() { title, excerpt, items }: CreateContestDTO,
    @UploadedFiles() files,
    @Req() { user }: any,
  ): Promise<ContestDto> {
    const contest = await this.contestService.createContest(user.id, {
      title,
      excerpt,
      items,
      files,
    });
    const thumbnail = files.find(fieldNameFilter('thumbnail'));
    await unlinkAsync(thumbnail.path);

    const deletingFiles = items.map(async (_, i): Promise<void> => {
      const image = files.find(fieldNameFilter(`items[${i}][image]`));
      await unlinkAsync(image.path);
    });

    await Promise.all(deletingFiles);

    return contest;
  }

  // TODO: add schema validation
  @UseGuards(AuthGuard('jwt'))
  @Post('/:contestId')
  @ApiOperation({ summary: 'Update contest' })
  @ApiResponse({
    status: 200,
    type: HttpResponseMessageDto,
  })
  @UsePipes(new JoiValidationPipe(contestIdSchema, 'param'))
  @UseInterceptors(FileInterceptor('files'))
  public async update(
    @Param('contestId') contestId: string,
    @Body() { title, excerpt }: UpdateContestData,
    @UploadedFiles() files,
  ): Promise<HttpResponseMessageDto> {
    await this.contestService.updateContest(contestId, {
      title,
      excerpt,
      files,
    });

    return { message: 'Contest successfully updated!' };
  }

  @Post('/:contestId/reset')
  @ApiOperation({ summary: 'Reset contest' })
  @ApiResponse({
    status: 200,
    type: ContestDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new JoiValidationPipe(contestIdSchema, 'param'))
  public async reset(
    @Param('contestId') contestId: string,
    @Req() { user }: any,
  ): Promise<ContestDto> {
    const { author } = await this.contestService.findContestById(contestId);
    if (author.toString() !== user.id.toString()) {
      throw new ForbiddenException();
    }
    return await this.contestService.resetContest(contestId);
  }

  @Delete('/:contestId')
  @ApiOperation({ summary: 'Delete contest' })
  @ApiResponse({
    status: 200,
    type: HttpResponseMessageDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new JoiValidationPipe(contestIdSchema, 'param'))
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
