import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { EmailProcessor } from '../queus/email.queue';
import { EmailService } from '../services/email.service';
import { QueueService } from '../services/queue.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailProcessor, QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
