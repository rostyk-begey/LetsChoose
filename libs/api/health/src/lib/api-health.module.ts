import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ApiHealthController } from './api-health.controller';

@Module({
  imports: [HttpModule, TerminusModule],
  controllers: [ApiHealthController],
  providers: [],
  exports: [],
})
export class ApiHealthModule {}
