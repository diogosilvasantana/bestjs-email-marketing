import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailConnectConfigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  service: string;

  @Column({ nullable: true })
  gmailUser: string;

  @Column({ nullable: true })
  gmailPass: string;

  @Column({ nullable: true })
  awsRegion: string;

  @Column({ nullable: true })
  awsAccessKeyId: string;

  @Column({ nullable: true })
  awsSecretAccessKey: string;

  @Column({ default: false })
  isActive: boolean;
}
