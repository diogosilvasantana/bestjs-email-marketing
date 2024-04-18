import { EncryptPasswordUtils } from './../utils/encrypt-password';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailConnectConfigEntity } from '../persistence/entities/email-connect-config.entity';

@Injectable()
export class EmailConnectConfigService {
  constructor(
    @InjectRepository(EmailConnectConfigEntity)
    private readonly configRepository: Repository<EmailConnectConfigEntity>,
    private readonly encryptPassword: EncryptPasswordUtils,
  ) {}

  async saveConfig(
    config: Partial<EmailConnectConfigEntity>,
  ): Promise<EmailConnectConfigEntity> {
    // Criptografe as configurações sensíveis antes de salvar
    if (config.gmailPass) {
      config.gmailPass = this.encryptPassword.encrypt(config.gmailPass);
    }
    if (config.awsAccessKeyId) {
      config.awsAccessKeyId = this.encryptPassword.encrypt(
        config.awsAccessKeyId,
      );
    }
    if (config.awsSecretAccessKey) {
      config.awsSecretAccessKey = this.encryptPassword.encrypt(
        config.awsSecretAccessKey,
      );
    }

    return this.configRepository.save(config);
  }

  async getActiveConfig(): Promise<EmailConnectConfigEntity> {
    let config = await this.configRepository.findOne({
      where: { isActive: true },
    });

    if (config === null) {
      config = new EmailConnectConfigEntity();
      config.service = 'GMAIL';
      return config;
    }

    // Descriptografe as configurações sensíveis antes de retornar
    if (config.gmailPass) {
      config.gmailPass = this.encryptPassword.decrypt(config.gmailPass);
    }
    if (config.awsAccessKeyId) {
      config.awsAccessKeyId = this.encryptPassword.decrypt(
        config.awsAccessKeyId,
      );
    }
    if (config.awsSecretAccessKey) {
      config.awsSecretAccessKey = this.encryptPassword.decrypt(
        config.awsSecretAccessKey,
      );
    }

    return config;
  }

  async setActiveService(service: string): Promise<void> {
    // Primeiro, desative todas as configurações
    await this.configRepository.update({ isActive: true }, { isActive: false });

    // Em seguida, ative a configuração para o serviço especificado
    await this.configRepository.update({ service }, { isActive: true });

    // Não atualize a instância do adaptador de serviço aqui
  }
}
