import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailMarketingModule } from './email-marketing/email-marketing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMarketingEntity } from './email-marketing/persistence/entities/email-marketing.entity';
import { BullModule } from '@nestjs/bull';
import { EmailConnectConfigEntity } from './email-marketing/persistence/entities/email-connect-config.entity';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'email-marketing-redis', // Use o nome do serviço Redis
        port: 6379,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'app-database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'email-marketing',
      entities: [EmailMarketingEntity, EmailConnectConfigEntity],
      synchronize: true,
      logging: true,
    }),
    EmailMarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
