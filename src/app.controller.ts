import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse } from './common/interface/base-response.interface';
import { PrismaService } from './common/prisma/prisma.service';
import { EmailService } from './common/services/email.service';
import { QueueService } from './common/services/queue.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly queueService: QueueService,
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

  @Get('test-email-queue')
  async testQueue(): Promise<BaseResponse<boolean>> {
    await this.queueService.sendEmailViaQueue();
    return {
      message: 'Test job added to queue',
      data: true,
    };
  }
}
