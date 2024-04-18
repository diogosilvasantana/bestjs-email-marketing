import { Injectable, OnModuleInit } from '@nestjs/common';
import { EmailConnectConfigService } from './email-connect-config.service';
import { GmailServiceAdapter } from '../adapters/service-connection/gmail-service.adapter';
import { AwsSesAdapter } from '../adapters/service-connection/aws-service.adapter';

@Injectable()
export class ServiceConnectionAdapterService implements OnModuleInit {
  private adapterInstance;

  constructor(private configService: EmailConnectConfigService) {}

  async onModuleInit() {
    await this.updateAdapterInstance();
  }

  async updateAdapterInstance() {
    const config = await this.configService.getActiveConfig();

    switch (config.service) {
      case 'GMAIL':
        this.adapterInstance = new GmailServiceAdapter();
        break;
      case 'AWS_SES':
        this.adapterInstance = new AwsSesAdapter();
        break;
      default:
        throw new Error('Invalid email service provider');
    }
  }

  getAdapterInstance() {
    return this.adapterInstance;
  }
}
