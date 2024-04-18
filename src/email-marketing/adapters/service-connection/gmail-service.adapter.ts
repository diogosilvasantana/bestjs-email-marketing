/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ServiceConnectionAdapter } from './service-connection.adapter';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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

  async verifyConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transporter.verify((error, success) => {
        if (error) {
          reject('Erro ao conectar ao serviço de e-mail: ' + error);
        } else {
          resolve();
        }
      });
    });
  }

  async sendEmail(
    subject: string,
    bodyOrFilePath: string,
    contact: any,
  ): Promise<void> {
    console.log('GMAIL Adapter');
    let body;
    if (existsSync(join(__dirname, bodyOrFilePath))) {
      body = readFileSync(join(__dirname, bodyOrFilePath), 'utf8');
    } else {
      body = bodyOrFilePath;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: contact,
        subject,
        html: body,
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
