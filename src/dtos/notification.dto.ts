import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  recipientId: string;
}

export class SendBulkNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  message: string;
}
