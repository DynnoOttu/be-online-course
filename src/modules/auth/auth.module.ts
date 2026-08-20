import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
  providers: [AuthService, JwtTokenService, UsersService, UsersRepository],
  exports: [AuthService],
})
export class AuthModule {}
