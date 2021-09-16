import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';
import { PasswordHashService } from './password.service';

@Module({
  providers: [JwtService, EmailService, PasswordHashService, DatabaseService],
  exports: [JwtService, EmailService, PasswordHashService, DatabaseService],
})
export class ApiCommonServicesModule {}
