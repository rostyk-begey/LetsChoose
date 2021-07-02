import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtService } from '@modules/common/jwt/jwt.service';
import { EmailService } from '@modules/common/email/email.service';
import { PasswordHashService } from '@modules/common/password/password.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [JwtService, EmailService, PasswordHashService],
  exports: [JwtService, EmailService, PasswordHashService],
})
export class CommonModule {}
