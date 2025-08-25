import { IsEmail, IsNotEmpty } from 'class-validator';

export default class RecoveryEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
