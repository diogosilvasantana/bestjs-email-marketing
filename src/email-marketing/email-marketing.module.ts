import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMarketingEntity } from './persistence/entities/email-marketing.entity';
import { EmailMarketingController } from './controller/email-marketing.controller';
import { EmailMarketingService } from './usecase/email-marketing.service';
import { SendEmailService } from './usecase/send-email.service';
import { SendEmailWorker } from './workers/send-email.worker';
import { BullModule } from '@nestjs/bull';
import { ProgressGateway } from './progress/progress.gateway';
import { SaveEmailSendService } from './usecase/save-email-send.service';
import { GmailServiceAdapter } from './adapters/service-connection/gmail-service.adapter';
import { AwsSesAdapter } from './adapters/service-connection/aws-service.adapter';
import { EmailConnectConfigService } from './usecase/email-connect-config.service';
import { EmailConnectConfigController } from './controller/email-connect-config.controller';
import { EmailConnectConfigEntity } from './persistence/entities/email-connect-config.entity';
import { EncryptPasswordUtils } from './utils/encrypt-password';
import { ServiceConnectionAdapterService } from './usecase/service-connection-adapter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailMarketingEntity, EmailConnectConfigEntity]),
    BullModule.registerQueue({
      name: 'emails',
    }),
  ],
  controllers: [EmailMarketingController, EmailConnectConfigController],
  providers: [
    EmailMarketingService,
    SendEmailService,
    SaveEmailSendService,
    SendEmailWorker,
    EmailConnectConfigService,
    ServiceConnectionAdapterService,
    EncryptPasswordUtils,
    ProgressGateway,
    {
      provide: 'ServiceConnectionAdapter',
      useFactory: () => {
        switch (process.env.EMAIL_SERVICE) {
          case 'GMAIL':
            return new GmailServiceAdapter();
          case 'AWS_SES':
            return new AwsSesAdapter();
          default:
            throw new Error('Invalid email service provider');
        }
      },
    },
  ],
})
export class EmailMarketingModule {}
