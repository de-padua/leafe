import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FileDTO {
 @IsNotEmpty()
 fieldname:string

  @IsNotEmpty()
  originalname: string;

  @IsNotEmpty()
  mimetype: string;

  buffer: Buffer;

  @IsNotEmpty()
  size: number;
}

export class UploadFilesDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDTO)
  files: FileDTO[];
}


