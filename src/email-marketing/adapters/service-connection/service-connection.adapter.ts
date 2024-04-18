export interface ServiceConnectionAdapter {
  sendEmail(
    subject: string,
    bodyOrFilePath: string,
    contact: any,
  ): Promise<void>;
  verifyConnection(): Promise<void>;
}
