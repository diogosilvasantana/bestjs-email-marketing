import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailMarketingModule } from './email-marketing/email-marketing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMarketingEntity } from './email-marketing/persistence/entities/email-marketing.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'emails',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'email-marketing',
      entities: [EmailMarketingEntity],
      synchronize: true,
      logging: true,
    }),
    EmailMarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
