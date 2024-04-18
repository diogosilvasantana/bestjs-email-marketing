import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailConnectConfigEntity } from '../persistence/entities/email-connect-config.entity';
import { EmailConnectConfigService } from '../usecase/email-connect-config.service';
import { ServiceConnectionAdapterService } from '../usecase/service-connection-adapter.service';

@Controller('email-config')
export class EmailConnectConfigController {
  constructor(
    private readonly configService: EmailConnectConfigService,
    private readonly serviceConnectionAdapterService: ServiceConnectionAdapterService,
  ) {}

  @Post()
  async saveConfig(
    @Body() config: Partial<EmailConnectConfigEntity>,
  ): Promise<EmailConnectConfigEntity> {
    return this.configService.saveConfig(config);
  }

  @Post('set-service')
  async setService(@Body('service') service: string): Promise<void> {
    await this.configService.setActiveService(service);
    await this.serviceConnectionAdapterService.updateAdapterInstance();
  }

  @Get()
  async getConfig(): Promise<EmailConnectConfigEntity> {
    return this.configService.getActiveConfig();
  }
}
