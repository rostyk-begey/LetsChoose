import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { ContestModule } from '@modules/contest/contest.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ApiUserDataAccessModule, ContestModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class ApiUserFeatureModule {}
