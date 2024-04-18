import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  htmlFilePath?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
