export interface ServiceConnectionAdapter {
  sendEmail(subject: string, body: string, contact: any): Promise<void>;
}
