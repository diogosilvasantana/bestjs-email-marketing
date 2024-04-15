import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendEmailService } from '../usecase/send-email.service';
import { ProgressGateway } from '../progress/progress.gateway';

@Processor('emails')
export class SendEmailWorker {
  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly progressGateway: ProgressGateway,
  ) {}

  @Process('send-email')
  async sendEmail(
    job: Job<{ subject: string; body: string; contact: any }>,
  ): Promise<void> {
    const { subject, body, contact } = job.data;

    try {
      // Envie o e-mail e atualize o progresso
      await this.sendEmailService.sendEmail(subject, body, contact);
      this.progressGateway.sendProgressUpdate({
        message: `E-mail enviado para ${contact.name} (${contact.email})`,
        progress: 'complete',
      });
    } catch (error) {
      this.progressGateway.sendProgressUpdate({
        message: `Erro ao enviar e-mail para ${contact.name} (${contact.email}): ${error.message}`,
        progress: 'error',
      });
    }
  }
}
