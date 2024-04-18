import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendEmailService } from '../usecase/send-email.service';
import { ProgressGateway } from '../progress/progress.gateway';
import { SaveEmailSendService } from '../usecase/save-email-send.service';
import { readFileSync } from 'fs';

@Processor('emails')
export class SendEmailWorker {
  private static emailCount = 0; // Contador estático para acompanhar o número de e-mails enviados

  constructor(
    private readonly sendEmailService: SendEmailService,
    private readonly progressGateway: ProgressGateway,
    private readonly saveEmailSendService: SaveEmailSendService,
  ) {}

  @Process('send-email')
  async sendEmail(
    job: Job<{
      subject: string;
      body: string;
      htmlFilePath: string;
      contact: any;
      contactLength: number;
    }>,
  ): Promise<void> {
    const { subject, contact, contactLength, htmlFilePath } = job.data;
    let { body } = job.data;

    // Se htmlFilePath for fornecido, leia o arquivo HTML e use-o como o corpo do e-mail
    if (htmlFilePath) {
      body = readFileSync(htmlFilePath, 'utf-8');
    }

    try {
      // Envie o e-mail
      await this.sendEmailService.sendEmail(
        subject,
        body,
        htmlFilePath,
        contact.email,
      );

      // Incrementar o contador de e-mails
      SendEmailWorker.emailCount++;

      // Emita o progresso
      this.progressGateway.sendProgressUpdate(
        SendEmailWorker.emailCount,
        contactLength,
        `E-mail enviado para ${contact.name} (${contact.email})`,
      );

      await this.saveEmailSendService.create({
        name: contact.name,
        email: contact.email,
        subject: subject,
        status: 'success',
      });
    } catch (error) {
      // Lidar com erros
      this.progressGateway.sendProgressUpdate(
        SendEmailWorker.emailCount,
        contactLength,
        `Erro ao enviar e-mail para ${contact.name} (${contact.email}): ${error.message}`,
      );

      // Salve o erro em algum tipo de armazenamento persistente
      await this.saveEmailSendService.create({
        name: contact.name,
        email: contact.email,
        subject: subject,
        status: 'error',
      });

      // Lançar o erro para interromper a execução
      throw error;
    }

    // Se todos os e-mails foram enviados, zerar o contador de e-mails e enviar mensagem de conclusão
    if (SendEmailWorker.emailCount === contactLength) {
      SendEmailWorker.emailCount = 0;
      this.progressGateway.sendCompletionMessage(contactLength);
    }

    // Aguardar um intervalo de tempo antes de processar o próximo email
    // Isso cria um intervalo de 5 segundos entre o envio de emails
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
