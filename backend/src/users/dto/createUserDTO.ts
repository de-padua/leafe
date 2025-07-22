import {
  IsEnum,
  IsIn,
  isNotEmpty,
  IsObject,
  IsOptional,
  isString,
  MaxLength,
} from 'class-validator';
import { MinLength } from 'class-validator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { userMetadataDto } from './user-metadata.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(245)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(120)
  bio: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(155)
  profilePictureUrl: string;


}
