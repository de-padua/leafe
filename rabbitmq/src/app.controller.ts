import {
  Controller,
  Get,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FileDTO } from './dto/FilesDTO';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('images-to-opt-placed')
 async handlePhotosOptmization(
    @Payload() data: { files: FileDTO[]; postId: string },
  ) {
    const { files, postId } = data;

     const deserializedFiles = files.map(f => ({
    ...f,
    buffer: Buffer.from(f.buffer as unknown as string, 'base64'),
  }));

    return await this.appService.uploadImages(deserializedFiles, postId);
  }
}
