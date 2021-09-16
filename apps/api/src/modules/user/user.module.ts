import { ApiUserDataAccessModule } from '@lets-choose/api/user/data-access';
import { forwardRef, Module } from '@nestjs/common';

import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { ContestModule } from '@modules/contest/contest.module';

@Module({
  imports: [ApiUserDataAccessModule, forwardRef(() => ContestModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
