import {
  IsBoolean,
  isBoolean,
  IsDate,
  IsInt,
  isInt,
  isNotEmpty,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class userMetadataDto {
  @IsBoolean({})
  @IsOptional()
  emailVerifed: boolean;
  @IsBoolean({})
  @IsOptional()
  twoFactorEnabled: boolean;
  @IsString({})
  @IsOptional()
  twoFactorSecret: string;
  @IsString({})
  @IsOptional()
  registrationIp: string;
  @IsString({})
  @IsOptional()
  registrationDevice: string;
  @IsDate({})
  @IsOptional()
  lastLogin: Date;
  @IsString({})
  @IsOptional()
  lastLoginIp: string;
  @IsInt()
  @IsOptional()
  loginCount: string;
  @IsInt()
  @IsOptional()
  failedLoginAttempts: string;
  @IsInt()
  @IsOptional()
  profileVersion: string;
  @IsDate({})
  @IsOptional()
  createdAt: Date;
  @IsDate({})
  @IsOptional()
  updatedAt: Date;
  @IsDate({})
  @IsOptional()
  accountLockedUntil: Date;
}
