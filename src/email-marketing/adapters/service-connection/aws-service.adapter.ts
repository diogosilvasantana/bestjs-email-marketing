import { ServiceConnectionAdapter } from './service-connection.adapter';

class AwsSesAdapter implements ServiceConnectionAdapter {
  async sendEmail(subject: string, body: string, contact: any): Promise<void> {
    // Implemente a lógica para enviar um e-mail usando o AWS SES aqui
  }
}
