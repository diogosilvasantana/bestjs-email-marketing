import { Injectable, Inject } from '@nestjs/common';
import { ServiceConnectionAdapter } from '../adapters/service-connection/service-connection.adapter';
import { readFileSync } from 'fs';

@Injectable()
export class SendEmailService {
  constructor(
    @Inject('ServiceConnectionAdapter')
    private readonly serviceConnectionAdapter: ServiceConnectionAdapter,
  ) {}

  async sendEmail(
    subject: string,
    body: string,
    htmlFilePath: string,
    contact: any,
  ): Promise<void> {
    let bodyOrFilePath = body;

    // Se htmlFilePath for fornecido, leia o arquivo HTML e use-o como o corpo do e-mail
    if (htmlFilePath) {
      bodyOrFilePath = readFileSync(htmlFilePath, 'utf-8');
    }

    await this.serviceConnectionAdapter.sendEmail(
      subject,
      bodyOrFilePath,
      contact,
    );
  }
}
