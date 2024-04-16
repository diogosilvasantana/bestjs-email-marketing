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

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailMarketingEntity]),
    BullModule.registerQueue({
      name: 'emails',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [EmailMarketingController],
  providers: [
    EmailMarketingService,
    SendEmailService,
    SaveEmailSendService,
    SendEmailWorker,
    ProgressGateway,
    {
      provide: 'ServiceConnectionAdapter',
      useClass: GmailServiceAdapter,
    },
  ],
})
export class EmailMarketingModule {}
