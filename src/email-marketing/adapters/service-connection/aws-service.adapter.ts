import { ServiceConnectionAdapter } from './service-connection.adapter';
import { SES } from 'aws-sdk';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class AwsSesAdapter implements ServiceConnectionAdapter {
  private readonly ses;

  constructor() {
    this.ses = new SES({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async sendEmail(
    subject: string,
    bodyOrFilePath: string,
    contact: any,
  ): Promise<void> {
    console.log('AWS SES Adapter');
    let body;
    if (existsSync(join(__dirname, bodyOrFilePath))) {
      body = readFileSync(join(__dirname, bodyOrFilePath), 'utf8');
    } else {
      body = bodyOrFilePath;
    }

    const params = {
      Destination: {
        ToAddresses: [contact],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.AWS_SES_SOURCE_EMAIL,
    };

    await this.ses.sendEmail(params).promise();
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.ses.listIdentities().promise();
    } catch (error) {
      throw new Error('Erro ao conectar ao AWS SES: ' + error.message);
    }
  }
}
