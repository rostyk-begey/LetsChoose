import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { ApiHealthController } from './api-health.controller';

describe('ApiHealthController', () => {
  let controller: ApiHealthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule, TerminusModule],
      controllers: [ApiHealthController],
    }).compile();

    controller = module.get(ApiHealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
