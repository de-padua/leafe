import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';
import { FileDTO, UploadFilesDTO } from './dto/fileUpload';
import { randomUUID } from 'crypto';
import { CreatePropertyDto } from './dto/createAdDTO';
import sharp from 'sharp';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AnuncioService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('rabbitmq') private rabbitClient: ClientProxy,
  ) {}

  async createAd(ad: CreatePropertyDto, postId: string, userId: string) {
    try {
      const newAd = await this.prisma.imovel.create({
        data: {
          ...ad,
          lastUpdate: new Date(),
          views: 0,
          isActive: true,
          userId: userId,
          isFeatured: false,
          id: postId,
          type: ad.type,
        },
        include: {
          imovelImages: true,
        },
      });

      return newAd;
    } catch (err) {
      throw err;
    }
  }
  async uploadImages(files: FileDTO[], postId: string) {
    try {
      const serializedFiles = files.map((file) => ({
        ...file,
        buffer: file.buffer.toString('base64'),
      }));
      const response$ = this.rabbitClient.send('images-to-opt-placed', {
        files: serializedFiles,
        postId: postId,
      });

      const result = await lastValueFrom(response$);

      const setImagesToDatabase = await this.prisma.imovelImages.createMany({
        data: result.map((img) => ({
          imovelId: img.imovelId,
          imageUrl: img.imageUrl,
          id: img.id,
        })),
      });
      return setImagesToDatabase;
    } catch (err) {
      console.error(`aAAAA`);
      throw err;
    }
  }
}
