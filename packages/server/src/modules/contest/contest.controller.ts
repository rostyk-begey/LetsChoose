import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  Contest,
  GetContestQuery,
  GetContestsResponse,
  GetItemsQuery,
  GetItemsResponse,
} from '@lets-choose/common';
import { TYPES } from '../../injectable.types';
// import { Contest } from './contest.schema';
import { ContestItem } from './contest-item.schema';
import { IContestService } from '../../abstract/contest.service.interface';

@Controller('/api/contests')
export class ContestController {
  constructor(
    @Inject(TYPES.ContestService)
    private readonly contestService: IContestService,
  ) {}

  @Get('/')
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
  public async getItems(
    @Param('contestId') contestId: string,
    @Query() query: GetItemsQuery,
  ): Promise<GetItemsResponse> {
    return await this.contestService.getContestItemsPaginate(contestId, query);
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('files'))
  public async create(
    @Body('title') title: string,
    @Body('excerpt') excerpt: string,
    @Body('items') items: Pick<ContestItem, 'title'>[],
    @UploadedFiles() files,
    @Req() { user },
  ): Promise<any> {
    await this.contestService.createContest(user.id, {
      title,
      excerpt,
      items,
      files,
    });

    return { message: 'Contest successfully created!' };
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('files'))
  @Post('/:contestId')
  public async update(
    @Param('contestId') contestId: string,
    @Body('title') title: string,
    @Body('excerpt') excerpt: string,
    @UploadedFiles() files,
  ): Promise<any> {
    await this.contestService.updateContest(contestId, {
      title,
      excerpt,
      files,
    });

    return { message: 'Contest successfully updated!' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:contestId')
  public async remove(@Param('contestId') contestId: string): Promise<any> {
    await this.contestService.removeContest(contestId);

    return { message: 'Contest successfully deleted!' };
  }
}
