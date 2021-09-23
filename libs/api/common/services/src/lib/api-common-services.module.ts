import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';
import { MongoosePaginationService } from './mongoose-pagination.service';
import { PasswordHashService } from './password.service';

@Module({
  providers: [
    JwtService,
    EmailService,
    PasswordHashService,
    DatabaseService,
    MongoosePaginationService,
  ],
  exports: [
    JwtService,
    EmailService,
    PasswordHashService,
    DatabaseService,
    MongoosePaginationService,
  ],
})
export class ApiCommonServicesModule {}
