import { IsEnum, IsIn, isString, MaxLength } from 'class-validator';
import { MinLength } from 'class-validator';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class userDataToUpdateDto {
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(245)
  password: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  lastName: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(120)
  bio: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(155)
  profilePictureUrl: string;

  @IsIn(['all', 'verified'])
  @IsOptional()
  preferences: string;
}
