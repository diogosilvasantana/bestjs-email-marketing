import * as crypto from 'crypto';

export class EncryptPasswordUtils {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.randomBytes(32);
  private readonly iv = crypto.randomBytes(16);

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(text: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
