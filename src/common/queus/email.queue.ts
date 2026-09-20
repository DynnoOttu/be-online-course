import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from '../services/email.service';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  templateData: any;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private readonly emailService: EmailService) {}

  @Process('send')
  async handleSendEmail(job: Job<EmailJobData>) {
    this.logger.log(`Processing job ${job.id} `);

    try {
      const { to, subject, text, html, template, templateData } = job.data;

      let emailHtml = html;
      if (template && templateData) {
        emailHtml = this.emailService.compileTamplate(template, templateData);
      }

      const email = await this.emailService.sendEmail({
        to,
        subject,
        text,
        html: emailHtml,
      });

      if (email) {
        this.logger.log(`Email job ${job.id} send successfully`);
      } else {
        this.logger.error(`Email job ${job.id} failed to send`);
      }
      return email;
    } catch (error) {
      this.logger.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }
}
