import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { UsersRepository } from '../users/repositories/users.repositories';
import { UsersService } from '../users/services/users.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtTokenService } from './services/jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    UsersService,
    UsersRepository,
    FileUploadService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
