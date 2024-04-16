import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ServiceConnectionAdapter } from './service-connection.adapter';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GmailServiceAdapter implements ServiceConnectionAdapter {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendEmail(subject: string, body: string, contact: any): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: contact,
        subject,
        text: body,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new HttpException(
        'Erro ao enviar e-mail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
