import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/user-role.enum';
import { BaseResponse } from 'src/common/interface/base-response.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginDto } from 'src/modules/users/dto/login-dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
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
}
