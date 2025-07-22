import { IsNotEmpty, IsString } from 'class-validator';

export class updateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
