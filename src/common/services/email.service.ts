import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as hbs from 'hbs';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import * as path from 'path';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.CreateTransporter();
  }

  private CreateTransporter(): void {
    const smptHost = this.configService.get<string>('SMTP_HOST');
    const smptPort = this.configService.get<number>('SMTP_PORT');
    const smptUser = this.configService.get<string>('SMTP_USER');
    const smptPassword = this.configService.get<string>('SMTP_PASSWORD');

    if (!smptHost || !smptPort || !smptUser || !smptPassword) {
      this.logger.warn(
        'SMTP configuration is incomplete. Email service will not work.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: smptHost,
      port: smptPort,
      auth: {
        user: smptUser,
        pass: smptPassword,
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection established successfully.');
    } catch (e) {
      this.logger.error('Failed to establish SMTP connection.', e);
      //this.CreateTransporter();
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn(
        'EMail transporter is not configured. Attempting to create transporter.',
      );
      return false;
    }

    try {
      const defaultForm = this.configService.get<string>('SMTP_EMAIL_SENDER');

      const mailOptions = {
        from: options.from || defaultForm,
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Email send to ${mailOptions.to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending email', error);
      return false;
    }
  }

  private compileTable(template: string, data: any): string {
    try {
      const tamplatePath = path.join(
        process.cwd(),
        'src',
        'common',
        'templates',
        'email',
        `${template}.hbs`,
      );

      const templateSource = fs.readFileSync(tamplatePath, 'utf-8');
      const compiledTemplate = hbs.compile(templateSource);
      return compiledTemplate(data);
    } catch (error) {
      this.logger.error('Error compiling email template:', error);
      return '<h1>Error compiling email template</h1><p>Unable to lod email content.</p>';
    }
  }

  async sendTestEmail(): Promise<boolean> {
    const html = this.compileTable('test', {
      name: 'test user',
      timestamp: new Date().toLocaleString(),
    });
    return this.sendEmail({
      to: '6oW3l@example.com',
      subject: 'Test email',
      html,
    });
  }
}
