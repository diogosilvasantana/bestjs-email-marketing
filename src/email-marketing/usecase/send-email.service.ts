import { Injectable, Inject } from '@nestjs/common';
import { ServiceConnectionAdapter } from '../adapters/service-connection/service-connection.adapter';

@Injectable()
export class SendEmailService {
  constructor(
    @Inject('ServiceConnectionAdapter')
    private readonly serviceConnectionAdapter: ServiceConnectionAdapter,
  ) {}

  async sendEmail(subject: string, body: string, contact: any): Promise<void> {
    await this.serviceConnectionAdapter.sendEmail(subject, body, contact);
  }
}
