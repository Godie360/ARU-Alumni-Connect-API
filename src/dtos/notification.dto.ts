// src/dtos/notification.dto.ts
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Welcome to Alumni Connect',
    description: 'Notification subject line',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    example: 'Thank you for joining our alumni network!',
    description: 'Notification message body',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    example: '12345678-1234-1234-1234-123456789012',
    description: 'UUID of recipient user',
  })
  @IsNotEmpty()
  @IsUUID()
  recipientId: string;
}

export class SendBulkNotificationDto {
  @ApiProperty({
    example: 'Upcoming Alumni Event',
    description: 'Notification subject line',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    example:
      'We are hosting a virtual alumni meetup next month. Save the date!',
    description: 'Notification message body',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
