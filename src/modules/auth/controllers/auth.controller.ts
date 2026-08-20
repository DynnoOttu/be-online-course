import { Body, Controller, Post } from '@nestjs/common';
import { BaseResponse } from 'src/common/interface/base-response.interface';
import { LoginDto } from 'src/modules/users/dto/login-dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ): Promise<BaseResponse<AuthResponseDto>> {
    return this.authService.login(loginDto);
  }
}
