import { ApiContestFeatureModule } from '@lets-choose/api/contest/feature';
import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ApiUserDataAccessModule, ApiContestFeatureModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class ApiUserFeatureModule {}
