import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtService } from './jwt/jwt.service';
import { EmailService } from './email/email.service';
import { PasswordHashService } from './password/password.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [JwtService, EmailService, PasswordHashService],
  exports: [JwtService, EmailService, PasswordHashService],
})
export class CommonModule {}
