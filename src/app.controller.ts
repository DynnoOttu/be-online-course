import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse } from './common/interface/base-response.interface';
import { PrismaService } from './common/prisma/prisma.service';
import { CacheService } from './common/services/cache.service';
import { EmailService } from './common/services/email.service';
import { QueueService } from './common/services/queue.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly queueService: QueueService,
    private readonly cacheService: CacheService,
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

  @Get('test-cache')
  async testCache(): Promise<BaseResponse<boolean>> {
    const key = 'test:key';
    const value = { message: 'Hello from cache' };

    await this.cacheService.set(key, value);
    const cacheValue = await this.cacheService.get(key);

    return {
      message: 'Cache test completed successfully',
      data: JSON.stringify(cacheValue) === JSON.stringify(value),
    };
  }
}
