import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailMarketingEntity } from '../persistence/entities/email-marketing.entity';
import { SaveEmailDto } from '../dto/save-email.dto';

@Injectable()
export class SaveEmailSendService {
  constructor(
    @InjectRepository(EmailMarketingEntity)
    private readonly repository: Repository<EmailMarketingEntity>,
  ) {}

  async create(dto: SaveEmailDto): Promise<EmailMarketingEntity> {
    const createdEntity = this.repository.create(dto);
    const result = this.repository.save(createdEntity);

    return result
      .then((res) => res)
      .catch((err) => {
        throw new Error(`Error while creating a new email: ${err}`);
      });
  }

  findAll(): Promise<EmailMarketingEntity[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<EmailMarketingEntity> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = this.repository.delete({ id });

    return await result
      .then(() => true)
      .catch((err) => {
        console.error(
          `Error while deleting a save email for the id ${id}`,
          err,
        );
        return false;
      });
  }
}
