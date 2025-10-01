import {
  Inject,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';
import { FileDTO, UploadFilesDTO } from './dto/fileUpload';
import { randomUUID } from 'crypto';
import { CreatePropertyDto } from './dto/createAdDTO';
import sharp from 'sharp';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdatePostDTO } from './dto/updatePostDTO';

@Injectable()
export class AnuncioService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('rabbitmq') private rabbitClient: ClientProxy,
  ) {}

  async updateAd(ad: UpdatePostDTO, postId: string, userId: string) {
    try {
      const existing = await this.prisma.imovel.findUnique({
        where: { id: postId },
      });

      if (!existing || existing.userId !== userId) {
        throw new MethodNotAllowedException(
          'Não autorizado a atualizar este anúncio.',
        );
      }

      const updatedAd = await this.prisma.imovel.update({
        where: { id: postId },
        data: {
          ...ad,
        },
        include: {
          imovelImages: true,
        },
      });

      return updatedAd;
    } catch (err) {
      throw err;
    }
  }
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

      const result: {
        imovelId: string;
        imageUrl: string;
        imageName: string;
        imageSize: number;
        imageType: string;
        id: string;
      }[] = await lastValueFrom(response$);

      const setImagesToDatabase = await this.prisma.imovelImages.createMany({
        data: result.map((img) => ({
          imovelId: img.imovelId,
          imageUrl: img.imageUrl,
          id: img.id,
          imageName: img.imageName,
          imageSize: img.imageSize,
          imageType: img.imageType,
        })),
      });

      const getPostData = await this.prisma.imovel.findFirst({
        where: {
          postId: postId,
        },
        include: {
          imovelImages: true,
          user:true
        },
      });
      return getPostData;
    } catch (err) {
      console.error(`aAAAA`);
      throw err;
    }
  }

  async deleteImage(imageId: string, imovelId: string, userId: string) {
    console.log(imageId,imovelId)
    await this.prisma.imovelImages.delete({
      where: {
        id: imageId,
      }
    });

    const updatedImoveil = await this.prisma.imovel.findFirst({
      where: {
        id: imovelId,
      },
      include: {
        imovelImages: true,
      },
    });
    return updatedImoveil;
  }
}
