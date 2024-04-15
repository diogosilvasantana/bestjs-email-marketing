import { Injectable } from '@nestjs/common';

@Injectable()
export class SendEmailService {
  async sendEmail(subject: string, body: string, contact: any): Promise<void> {
    // Aqui você implementaria a lógica para enviar um e-mail para o contato
    // Por exemplo, você pode usar uma biblioteca de e-mail como nodemailer
    // Aqui está um exemplo simplificado usando o console para simular o envio de e-mail
    console.log(
      `Simulando envio de e-mail para ${contact.name} (${contact.email}):`,
    );
    console.log(`Assunto: ${subject}`);
    console.log(`Corpo: ${body}`);
  }
}
