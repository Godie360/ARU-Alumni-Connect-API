import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Notification } from '../entities/notification.entity';
  import { NotificationsService } from './notifications.service';
  import { CreateNotificationDto, SendBulkNotificationDto } from '../dtos/notification.dto';
  import { GetUser } from '../auth/get-user.decorator';
  import { User } from '../entities/user.entity';
  import { Roles } from '../auth/roles.decorator';
  import { RolesGuard } from '../auth/roles.guard';
  import { UserRole } from '../enums/user-role.enum';
  
  @Controller('notifications')
  @UseGuards(AuthGuard())
  export class NotificationsController {
    constructor(private notificationsService: NotificationsService) {}
  
    @Get()
    findAll(
      @Query('recipientId') recipientId: string,
      @GetUser() user: User,
    ): Promise<Notification[]> {
      // If the user is an admin, they can get all notifications or filter by recipient
      // If the user is an alumni, they can only get their own notifications
      if (user.role === UserRole.ADMIN) {
        return this.notificationsService.findAll(recipientId);
      } else {
        return this.notificationsService.findAll(user.id);
      }
    }
  
    @Get(':id')
    findById(@Param('id') id: string): Promise<Notification> {
      return this.notificationsService.findById(id);
    }
  
    @Post()
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    create(@Body() createDto: CreateNotificationDto): Promise<Notification> {
      return this.notificationsService.create(createDto);
    }
  
    @Post('bulk')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    sendBulkNotification(@Body() createDto: SendBulkNotificationDto): Promise<void> {
      return this.notificationsService.sendBulkNotification(createDto);
    }
  
    @Patch(':id/read')
    markAsRead(@Param('id') id: string): Promise<Notification> {
      return this.notificationsService.markAsRead(id);
    }
  
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    delete(@Param('id') id: string): Promise<void> {
      return this.notificationsService.delete(id);
    }
  }
