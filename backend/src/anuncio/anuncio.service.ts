import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';
import { FileDTO, UploadFilesDTO } from './dto/fileUpload';
import { randomUUID } from 'crypto';
import { CreatePropertyDto } from './dto/createAdDTO';

@Injectable()
export class AnuncioService {
  constructor(private readonly prisma: PrismaService) {}

  async createAd(ad: CreatePropertyDto, postId: string, userId: string) {
    try{

     
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
    }
    catch(err){
      throw err
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
          const { data, error } = await supaclient.storage
            .from('images')
            .upload(
              `private/${file.originalname}/${randomUUID()}`,
              file.buffer,
              {
                contentType: file.mimetype,
                upsert: false,
              },
            );

          if (error) throw error;

          const path = `${supabaseUrl}/storage/v1/object/${data.fullPath}`;

          await this.prisma.imovelImages.create({
            data: {
              imageUrl: path,
              imovelId: postId,
              id: file.originalname.concat(randomUUID()),
            },
          });
        }),
      );

      return { success: true };
    } catch (error) {
      throw error
    }
  }
}
