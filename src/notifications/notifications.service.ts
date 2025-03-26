import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import {
  CreateNotificationDto,
  SendBulkNotificationDto,
} from '../dtos/notification.dto';
import { EmailService } from '../notifications/email.service';
import { VerificationStatus } from '../enums/verification-status.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async findAll(recipientId?: string): Promise<Notification[]> {
    const query = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.recipient', 'recipient');

    if (recipientId) {
      query.where('notification.recipientId = :recipientId', { recipientId });
    }

    return query.getMany();
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
      relations: ['recipient'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }

    return notification;
  }

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const { recipientId, subject, message } = createDto;

    // Check if recipient exists
    const recipient = await this.usersRepository.findOne({
      where: { id: recipientId },
    });
    if (!recipient) {
      throw new NotFoundException(`User with ID "${recipientId}" not found`);
    }

    // Create notification
    const notification = this.notificationsRepository.create({
      subject,
      message,
      recipientId,
    });

    // Save notification
    const savedNotification =
      await this.notificationsRepository.save(notification);

    // Send email
    await this.emailService.sendEmail(recipient.email, subject, message);

    return savedNotification;
  }

  async sendBulkNotification(
    createDto: SendBulkNotificationDto,
  ): Promise<void> {
    const { subject, message } = createDto;

    // Get all verified alumni
    const verifiedAlumni = await this.usersRepository.find({
      where: { verificationStatus: VerificationStatus.VERIFIED },
    });

    if (verifiedAlumni.length === 0) {
      return;
    }

    // Create notifications and send emails
    const notifications = verifiedAlumni.map((alumnus) => ({
      subject,
      message,
      recipientId: alumnus.id,
    }));

    await this.notificationsRepository.save(notifications);

    // Send emails in parallel
    const emailPromises = verifiedAlumni.map((alumnus) =>
      this.emailService.sendEmail(alumnus.email, subject, message),
    );

    await Promise.all(emailPromises);
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findById(id);
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async delete(id: string): Promise<void> {
    const notification = await this.findById(id);
    await this.notificationsRepository.remove(notification);
  }
}
