import { IsEmail, IsOptional, IsString, IsNumber, IsEnum, IsUrl } from 'class-validator';
import { VerificationStatus } from '../enums/verification-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  currentCompany?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  linkedInUrl?: string;
}

export class UpdateUserVerificationDto {
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus;
}
