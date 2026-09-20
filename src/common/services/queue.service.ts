import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import { EmailJobData } from '../queus/email.queue';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('email') private emailQueue: Queue<EmailJobData>) {}

  async addEmailJob(jobData: EmailJobData, option?: JobOptions): Promise<void> {
    try {
      const jobOption: JobOptions = {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60000, //1 menit
        },
        delay: option?.delay || 0,
        ...option,
      };

      const job = await this.emailQueue.add('send', jobData, jobOption);
      this.logger.log(`Email job ${job.id} added to queue`);
    } catch (error) {
      this.logger.error('Failed to add email job to queue: ', error);
      throw error;
    }
  }

  async sendEmailViaQueue(): Promise<void> {
    await this.addEmailJob({
      to: 'recipient@example.com',
      subject: 'Test email',
      template: 'test',
      templateData: {
        name: 'test user',
        timestamp: new Date().toLocaleString(),
      },
    });
  }
}
