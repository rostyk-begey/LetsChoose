import { User, UserSchema } from '@modules/user/user.entity';
import { forwardRef, Module } from '@nestjs/common';

import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { ContestModule } from '@modules/contest/contest.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => ContestModule),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
