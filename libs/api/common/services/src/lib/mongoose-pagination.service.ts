import {
  IMongoosePaginationService,
  PaginationOptions,
} from '@lets-choose/api/abstract';
import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { paginationSchema } from '@lets-choose/api/common/utils';
import { PipelineBuilder } from 'mongodb-pipeline-builder';

export const options = Joi.object<PaginationOptions>({
  page: Joi.number(),
});

@Injectable()
export class MongoosePaginationService implements IMongoosePaginationService {
  private validateOptions(options: PaginationOptions): PaginationOptions {
    const { value, error } = Joi.object(paginationSchema).validate(options);

    if (error) {
      throw error;
    }

    return value;
  }

  public getPaginationPipeline(
    options: PaginationOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): object[] {
    const { page = 1, perPage = 10 } = this.validateOptions(options);

    const builder = new PipelineBuilder('pagination', { debug: true });

    builder.Facet({
      metadata: [
        {
          $count: 'total',
        },
      ],
      items: [
        {
          $skip: (page - 1) * perPage,
        },
        {
          $limit: perPage,
        },
      ],
    });

    builder.Project({
      items: 1,
      // Get total from the first element of the metadata array
      totalItems: { $arrayElemAt: ['$metadata.total', 0] },
      totalPages: {
        $ceil: {
          $divide: [{ $arrayElemAt: ['$metadata.total', 0] }, perPage],
        },
      },
    });

    builder.AddFields({ currentPage: page });

    return builder.getPipeline();
  }
}
