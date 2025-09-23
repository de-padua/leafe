import { IsOptional, IsString, IsNumberString } from "class-validator";

export default class GetPublicUserDataQuery {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  price?: string;
}