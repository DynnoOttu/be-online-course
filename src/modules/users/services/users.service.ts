import { Injectable } from '@nestjs/common';
import { UsersResponseDto } from '../dto/users-response-dto';
import { UsersRepository } from '../repositories/users.repositories';
import {
  CreateUserData,
  CreateUserProfileData,
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

  async findById(id: number): Promise<UsersResponseDto | null> {
    const user = await this.usersRepository.findById(id);
    return user ? this.usersRepository.toResponseDto(user) : null;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.usersRepository.findByEmail(email);
    return !!user;
  }

  async register(
    userData: CreateUserData,
    profileData: CreateUserProfileData,
  ): Promise<UsersResponseDto> {
    const user = await this.usersRepository.createUserWithProfile(
      userData,
      profileData,
    );
    return this.usersRepository.toResponseDto(user);
  }
}
