import {
  Injectable,
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendEmailDto } from '../dto/send-email.dto';
import { ServiceConnectionAdapter } from '../adapters/service-connection/service-connection.adapter';

@Injectable()
export class EmailMarketingService {
  constructor(
    @InjectQueue('emails')
    private readonly emailQueue: Queue,
    @Inject('ServiceConnectionAdapter')
    private readonly serviceConnectionAdapter: ServiceConnectionAdapter,
  ) {}

  async sendBulkEmails(sendEmailDto: SendEmailDto): Promise<void> {
    const { subject, body, htmlFilePath, contacts } = sendEmailDto;

    // Obtenha o número de trabalhos ativos
    const jobCounts = await this.emailQueue.getJobCounts();
    const activeJobs = jobCounts.active;
    const contactLength = contacts.length;

    // Se houver algum trabalho ativo, lance um erro
    if (activeJobs > 0) {
      throw new ConflictException(
        'Um envio de email já está em andamento. Por favor, aguarde o fim do processamento.',
      );
    }

    try {
      await this.serviceConnectionAdapter.verifyConnection();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    for (const contact of contacts) {
      await this.emailQueue.add('send-email', {
        subject,
        body,
        htmlFilePath,
        contact,
        contactLength,
      });
    }
  }
}
