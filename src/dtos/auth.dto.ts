import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'enosh@gmail.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password221', description: 'Password of the user' })
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'enosh@gmail.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password221',
    description: 'Password of the user - minimum 8 characters',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Enosh', description: 'User first name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Godfrey', description: 'User last name' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 2024, description: 'Graduation year' })
  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @ApiProperty({ example: 'Computer Science', description: 'Course of study' })
  @IsOptional()
  course?: string;
}
