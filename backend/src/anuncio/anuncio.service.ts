import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';
import { FileDTO, UploadFilesDTO } from './dto/fileUpload';
import { randomUUID } from 'crypto';
import { CreatePropertyDto } from './dto/createAdDTO';
import sharp from 'sharp';
@Injectable()
export class AnuncioService {
  constructor(private readonly prisma: PrismaService) {}

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
      const supabaseUrl = 'https://qhljimmosiizyuxvrrlp.supabase.co';
      const supabaseKey = process.env.SUPABASEKEY!;
      const accessTokenSupabase = process.env.SUPABASEKEY_server!;

      const supaclient = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${accessTokenSupabase}`,
          },
        },
      });

      await Promise.all(
        files.map(async (file) => {
   
          const optimizedFile = await this.handleImageOptimization(file);

          const { data, error } = await supaclient.storage
            .from('images')
            .upload(
              `${postId}/${file.originalname.split('.')[0]}.webp`, // ← Remove "public/"
              optimizedFile,
              {
                contentType: 'image/webp',
                upsert: true,
              },
            );

          if (error) {
            await this.prisma.imovel.delete({
              where: {
                id: postId,
              },
            });
            throw error.message;
          }

          const path = `${supabaseUrl}/storage/v1/object/public/images/${postId}/${file.originalname.split('.')[0]}.webp`;
          await this.prisma.imovelImages.create({
            data: {
              imageUrl: path,
              imovelId: postId,
              id: randomUUID(),
            },
          });
        }),
      );

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async handleImageOptimization(file: FileDTO) {
    const bigImage = 2 * 1024 * 1024;
    const mediumImage = 1 * 1024 * 1024;
    const smallImage = 0.5 * 1024 * 1024;
    const extraSmallImage = Math.round(0.1 * 1024 * 1024);

    switch (true) {
      case file.size >= bigImage:
        return await sharp(file.buffer)
          .resize({
            width: 1920,
            withoutEnlargement: true,
          })
          .webp({
            quality: 40,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();

      case file.size >= mediumImage:
        return await sharp(file.buffer)
          .resize({
            width: 1920,
            withoutEnlargement: true,
          })
          .webp({
            quality: 50,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();

      case file.size >= smallImage:
        return await sharp(file.buffer)
          .webp({
            quality: 60,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();

      case file.size >= extraSmallImage:
        return await sharp(file.buffer)
          .webp({
            quality: 80,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();

      default:
        return await sharp(file.buffer)
          .webp({
            quality: 90,
            effort: 6,
            smartSubsample: true,
          })
          .toBuffer();
    }
  }

 
}
