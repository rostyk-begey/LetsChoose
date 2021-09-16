import { Test } from '@nestjs/testing';
import { ApiHealthController } from './api-health.controller';

describe('ApiHealthController', () => {
  let controller: ApiHealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiHealthController],
    }).compile();

    controller = module.get(ApiHealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
