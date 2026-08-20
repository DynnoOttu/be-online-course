import { Injectable } from '@nestjs/common';
import { UsersResponseDto } from '../dto/users-response-dto';
import { UsersRepository } from '../repositories/users.repositories';
import {
  UserWithRoleAndPermissions,
  UserWithRoleAndPermissionsWithoutPassword,
} from '../types/users.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<UsersResponseDto | null> {
    const user = await this.usersRepository.findByEmail(email);
    return user ? this.usersRepository.toResponseDto(user) : null;
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithRoleAndPermissions | null> {
    return this.usersRepository.findByEmail(email);
  }

  transformToDto(user: UserWithRoleAndPermissions): UsersResponseDto {
    return this.usersRepository.toResponseDto(user);
  }

  transformToDtoWithoutPassword(
    user: UserWithRoleAndPermissionsWithoutPassword,
  ): UsersResponseDto {
    return this.usersRepository.toResponseDto(
      user as UserWithRoleAndPermissions,
    );
  }
}
