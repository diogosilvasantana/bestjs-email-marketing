import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailMarketingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column()
  status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(0)' })
  sendAt: Date;
}
