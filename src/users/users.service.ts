
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UpdateUserVerificationDto } from '../dtos/user.dto';
import { UserRole } from '../enums/user-role.enum';
import { VerificationStatus } from '../enums/verification-status.enum';
import { UsersController } from '../users/users.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(userRole?: UserRole, verificationStatus?: VerificationStatus): Promise<User[]> {
    let query = this.usersRepository.createQueryBuilder('user');
    
    if (userRole) {
      query = query.andWhere('user.role = :userRole', { userRole });
    }
    
    if (verificationStatus) {
      query = query.andWhere('user.verificationStatus = :verificationStatus', { verificationStatus });
    }
    
    return query.getMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    const user = await this.findById(id);
    
    // Only allow users to update their own profile, unless they're an admin
    if (id !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this user');
    }

    // Update user properties
    const updatedUser = Object.assign(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  async updateVerificationStatus(id: string, updateDto: UpdateUserVerificationDto): Promise<User> {
    const user = await this.findById(id);
    
    // Update verification status
    user.verificationStatus = updateDto.verificationStatus;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string, currentUser: User): Promise<void> {
    const user = await this.findById(id);
    
    // Only allow users to delete their own account, unless they're an admin
    if (id !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to delete this user');
    }
    
    await this.usersRepository.remove(user);
  }
}


