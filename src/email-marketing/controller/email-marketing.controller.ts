import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDto } from '../dto/send-email.dto';
import { EmailMarketingService } from '../usecase/email-marketing.service';

@Controller('email')
export class EmailMarketingController {
  constructor(private readonly emailMarketingService: EmailMarketingService) {}

  @Post()
  async sendEmails(@Body() sendEmailDto: SendEmailDto): Promise<void> {
    await this.emailMarketingService.sendBulkEmails(sendEmailDto);
  }
}
