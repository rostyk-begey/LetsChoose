import { IMongoosePaginationService } from '@lets-choose/api/abstract';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoosePaginationService } from './mongoose-pagination.service';

describe('MongoosePaginationService', () => {
  let service: IMongoosePaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoosePaginationService],
    }).compile();

    service = module.get<MongoosePaginationService>(MongoosePaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaginationStages', () => {
    describe.each`
      page | perPage | skip
      ${1} | ${1}    | ${0}
      ${1} | ${10}   | ${0}
      ${2} | ${10}   | ${10}
      ${3} | ${10}   | ${20}
      ${4} | ${10}   | ${30}
    `(
      'getPaginationStages({ page: $page, perPage: $perPage })',
      ({ page, perPage, skip }) => {
        let facet, project, addFields;

        beforeAll(() => {
          [facet, project, addFields] = service.getPaginationPipeline({
            page,
            perPage,
          });
        });

        it('should contain correct facet stage', () => {
          expect(facet).toMatchObject({
            $facet: {
              metadata: [
                {
                  $count: 'total',
                },
              ],
              items: [
                {
                  $skip: skip,
                },
                {
                  $limit: perPage,
                },
              ],
            },
          });
        });

        it('should contain correct project stage', () => {
          expect(project).toMatchObject({
            $project: {
              items: 1,
              totalItems: { $arrayElemAt: ['$metadata.total', 0] },
              totalPages: {
                $ceil: {
                  $divide: [{ $arrayElemAt: ['$metadata.total', 0] }, perPage],
                },
              },
            },
          });
        });

        it('should contain correct addFields stage', () => {
          expect(addFields).toMatchObject({
            $addFields: {
              currentPage: page,
            },
          });
        });
      },
    );
  });
});
