import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersResponseDto } from '../dto/users-response-dto';
import {
  CreateUserData,
  CreateUserProfileData,
  UserWithRoleAndPermissions,
} from '../types/users.types';

@Injectable()
export class UsersRepository {
  private readonly userInclude = {
    role: {
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    },
    userProfile: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithRoleAndPermissions | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: this.userInclude,
    });
  }

  toResponseDto(user: UserWithRoleAndPermissions): UsersResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      role: {
        id: user.role.id,
        name: user.role.name,
        key: user.role.key,
        permissions: user.role.rolePermissions.map((rp) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          key: rp.permission.key,
          resource: rp.permission.resource,
        })),
      },
      userProfile: user.userProfile
        ? {
            id: user.userProfile.id,
            bio: user.userProfile.bio,
            avatar: user.userProfile.avatar,
            gender: user.userProfile.gender,
            expertise: user.userProfile.expertise,
            experienceYears: user.userProfile.experienceYears,
            linkedinUrl: user.userProfile.linkedinUrl,
            githubUrl: user.userProfile.githubUrl,
          }
        : null,
    };
  }

  async findById(id: number): Promise<UserWithRoleAndPermissions | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: this.userInclude,
    });
  }

  async createUserWithProfile(
    userData: CreateUserData,
    profileData?: CreateUserProfileData,
  ): Promise<UserWithRoleAndPermissions> {
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        userProfile: profileData ? { create: profileData } : undefined,
      },
      include: this.userInclude,
    });

    return user as UserWithRoleAndPermissions;
  }
}
