import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseResponse } from 'src/common/interface/base-response.interface';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { LoginDto } from 'src/modules/users/dto/login-dto';
import { RegisterDto } from 'src/modules/users/dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly FileUploadService: FileUploadService,
  ) {}

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ): Promise<BaseResponse<AuthResponseDto>> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatar', FileUploadService.getAvatarMulterConfig()),
  )
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<BaseResponse<RegisterResponseDto>> {
    try {
      const avatarUrl = avatar
        ? this.FileUploadService.getAvatarUrl(avatar.filename)
        : undefined;

      const registerData = {
        ...registerDto,
        avatar: avatarUrl,
      };

      return this.authService.register(registerData);
    } catch (error) {
      if (avatar) {
        this.FileUploadService.deleteAvatarByName(avatar.filename);
      }
      throw error;
    }
  }
}
