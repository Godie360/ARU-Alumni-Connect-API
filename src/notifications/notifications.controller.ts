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
import {
  CreateNotificationDto,
  SendBulkNotificationDto,
} from '../dtos/notification.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enums/user-role.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard())
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiQuery({
    name: 'recipientId',
    required: false,
    description: 'Filter by recipient ID (admin only)',
  })
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
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification Returned' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  findById(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findById(id);
  }

  @Post()
  @ApiTags('admin')
  @ApiOperation({
    summary: 'Create a new notification for specific user (Admin only)',
  })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires admin privileges',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createDto);
  }

  @Post('bulk')
  @ApiTags('admin')
  @ApiOperation({
    summary: 'Send a bulk notification to all verified alumni  (Admin only)',
  })
  @ApiBody({ type: SendBulkNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Bulk notification sent succesfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires admin privileges',
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  sendBulkNotification(
    @Body() createDto: SendBulkNotificationDto,
  ): Promise<void> {
    return this.notificationsService.sendBulkNotification(createDto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @ApiTags('admin')
  @ApiOperation({ summary: 'Delete a notification  (Admin only)' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - requires admin privileges',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  delete(@Param('id') id: string): Promise<void> {
    return this.notificationsService.delete(id);
  }
}
