import { Injectable, ConflictException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class EmailMarketingService {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async sendBulkEmails(sendEmailDto: SendEmailDto): Promise<void> {
    const { subject, body, contacts } = sendEmailDto;

    // Obtenha o número de trabalhos ativos
    const jobCounts = await this.emailQueue.getJobCounts();
    const activeJobs = jobCounts.active;
    const contactLength = contacts.length;

    // Se houver algum trabalho ativo, lance um erro
    if (activeJobs > 0) {
      throw new ConflictException(
        'Um envio de email já está em andamento. Aguarde.',
      );
    }

    for (const contact of contacts) {
      await this.emailQueue.add('send-email', {
        subject,
        body,
        contact,
        contactLength,
      });
    }
  }
}
