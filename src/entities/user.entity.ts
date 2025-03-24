
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { VerificationStatus } from '../enums/verification-status.enum';
import { Notification } from '../entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  graduationYear: number;

  @Column({ nullable: true })
  course: string;

  @Column({ nullable: true })
  currentCompany: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  linkedInUrl: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ALUMNI })
  role: UserRole;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  verificationStatus: VerificationStatus;

  @OneToMany(() => Notification, notification => notification.recipient)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
