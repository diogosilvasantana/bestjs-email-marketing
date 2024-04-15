import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class EmailMarketingService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendBulkEmails(sendEmailDto: SendEmailDto): Promise<void> {
    const { subject, body, contacts } = sendEmailDto;

    for (const contact of contacts) {
      await this.emailQueue.add('send-email', { subject, body, contact });
    }
  }
}
