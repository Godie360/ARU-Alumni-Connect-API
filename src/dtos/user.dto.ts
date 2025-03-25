import { IsOptional, IsString, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { VerificationStatus } from '../enums/verification-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  graduationYear?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  course?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  currentCompany?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bio?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  linkedInUrl?: string;
}

export class UpdateUserVerificationDto {
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus;
}
