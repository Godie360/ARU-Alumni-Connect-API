// src/dtos/user.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../enums/verification-status.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Godfrey', description: 'User first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Mussa', description: 'User last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 2020, description: 'Graduation year' })
  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @ApiPropertyOptional({
    example: 'Computer Science',
    description: 'Field of study',
  })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({
    example: 'Tech Company Inc.',
    description: 'Current company name',
  })
  @IsOptional()
  @IsString()
  currentCompany?: string;

  @ApiPropertyOptional({
    example: 'Software Engineer',
    description: 'Current job title',
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({
    example: 'Experienced software developer with 5 years in the industry',
    description: 'Short biography',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/johndoe',
    description: 'LinkedIn profile URL',
  })
  @IsOptional()
  @IsUrl()
  linkedInUrl?: string;
}

export class UpdateUserVerificationDto {
  @ApiProperty({
    enum: VerificationStatus,
    example: 'verified',
    description: 'User verification status',
  })
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus;
}
