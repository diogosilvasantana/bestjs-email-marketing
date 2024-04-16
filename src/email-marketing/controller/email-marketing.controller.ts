import { SaveEmailSendService } from './../usecase/save-email-send.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendEmailDto } from '../dto/send-email.dto';
import { EmailMarketingService } from '../usecase/email-marketing.service';

@Controller('email')
export class EmailMarketingController {
  constructor(
    private readonly emailMarketingService: EmailMarketingService,
    private readonly saveEmailSendService: SaveEmailSendService,
  ) {}

  @Post()
  async sendEmails(@Body() sendEmailDto: SendEmailDto): Promise<void> {
    await this.emailMarketingService.sendBulkEmails(sendEmailDto);
  }

  @Get()
  async listEmails() {
    return await this.saveEmailSendService.findAll();
  }
}
