import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/user-role.enum';
import { BaseResponse } from 'src/common/interface/base-response.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginDto } from 'src/modules/users/dto/login-dto';
import { RegisterDto } from 'src/modules/users/dto/register.dto';
import { UsersResponseDto } from 'src/modules/users/dto/users-response-dto';
import { UsersService } from 'src/modules/users/services/users.service';
import {
  CreateUserData,
  CreateUserProfileData,
} from 'src/modules/users/types/users.types';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { JwtTokenService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto): Promise<BaseResponse<AuthResponseDto>> {
    const user = await this.userService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    console.log(password);
    const userDto =
      this.userService.transformToDtoWithoutPassword(userWithoutPassword);

    const userWithStats = await this.addUserStatistic(userDto);

    const accessToken = this.jwtTokenService.generateToken(userDto);

    return {
      message: 'Login successful',
      data: {
        accessToken,
        user: userWithStats,
      },
    };
  }

  private async addUserStatistic(userDto: any): Promise<any> {
    const stats = { ...userDto };

    if (userDto.role.key === UserRole.MENTOR) {
      const totalCourses = await this.prisma.course.count({
        where: {
          mentorId: userDto.id,
        },
      });

      const totalStudentResult = await this.prisma.course.aggregate({
        _sum: {
          totalStudents: true,
        },
        where: {
          mentorId: userDto.id,
        },
      });

      stats.totalCourses = totalCourses;
      stats.totalStudents = totalStudentResult._sum.totalStudents || 0;
      stats.totalEndrollerdCourses = null;
    } else if (userDto.role.key === UserRole.STUDENT) {
      const totalEndrollerdCourses = await this.prisma.enrollment.count({
        where: {
          studentId: userDto.id,
        },
      });
      stats.totalEndrollerdCourses = totalEndrollerdCourses;
      stats.totalCourses = null;
      stats.totalStudents = null;
    } else {
      stats.totalCourses = null;
      stats.totalStudents = null;
      stats.totalEndrollerdCourses = null;
    }

    return stats;
  }

  async validateUser(userId: number): Promise<UsersResponseDto | null> {
    const user = await this.userService.findById(userId);
    return user;
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<BaseResponse<RegisterResponseDto>> {
    const isEMailTaken = await this.userService.isEmailTaken(registerDto.email);
    if (isEMailTaken) {
      throw new UnauthorizedException('Email already taken');
    }

    const role = await this.prisma.role.findUnique({
      where: {
        key: registerDto.role,
      },
    });

    if (!role) {
      throw new UnauthorizedException('Invalid role');
    }

    const hashPassword = await bcrypt.hash(registerDto.password, 10);

    const userData: CreateUserData = {
      email: registerDto.email,
      password: hashPassword,
      name: registerDto.name,
      roleId: role.id,
      phone: registerDto.phone,
      isVerified: true,
    };

    const userProfile: CreateUserProfileData = {
      bio: registerDto.bio,
      avatar: registerDto.avatar,
      gender: registerDto.gender,
      expertise: registerDto.expertise,
      experienceYears: registerDto.experienceYears,
      linkedinUrl: registerDto.linkedInUrl,
      githubUrl: registerDto.githubUrl,
    };

    const user = await this.userService.register(userData, userProfile);

    if (!user) {
      throw new BadRequestException('User not created');
    }

    return {
      message: 'User created successfully',
      data: {
        user,
      },
    };
  }
}
