import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repositories';
import { UsersService } from './services/users.service';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
