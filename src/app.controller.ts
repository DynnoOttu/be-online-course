import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse } from './common/interface/base-response.interface';
import { PrismaService } from './common/prisma/prisma.service';
import { EmailService } from './common/services/email.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-roles')
  async testRoles() {
    return await this.prisma.role.findMany();
  }

  @Get('test-email')
  async testEmail(): Promise<BaseResponse<boolean>> {
    const result = await this.emailService.sendTestEmail();
    return {
      message: 'Success',
      data: result,
    };
  }
}
