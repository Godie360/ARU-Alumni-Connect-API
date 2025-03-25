import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UpdateUserVerificationDto } from '../dtos/user.dto';
import { UsersService } from './users.service';
import { GetUser } from '../auth/get-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enums/user-role.enum';
import { VerificationStatus } from '../enums/verification-status.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('Users')
@UseGuards(AuthGuard())
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(
    @Query('role') role?: UserRole,
    @Query('verificationStatus') verificationStatus?: VerificationStatus,
  ): Promise<User[]> {
    return this.usersService.findAll(role, verificationStatus);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, user);
  }

  @Patch(':id/verification')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateVerificationStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserVerificationDto,
  ): Promise<User> {
    return this.usersService.updateVerificationStatus(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteUser(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.usersService.deleteUser(id, user);
  }
}
