import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '@modules/common/database/database.service';
import { JwtService } from '@modules/common/jwt/jwt.service';
import { EmailService } from '@modules/common/email/email.service';
import { PasswordHashService } from '@modules/common/password/password.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [JwtService, EmailService, PasswordHashService, DatabaseService],
  exports: [JwtService, EmailService, PasswordHashService, DatabaseService],
})
export class CommonModule {}
