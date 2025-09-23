import { Injectable } from '@nestjs/common';
import { FileDTO } from './dto/FilesDTO';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { randomUUID, UUID } from 'crypto';

@Injectable()
export class AppService {
  async imagesOptmization(file: FileDTO) {
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

  async uploadImages(files: FileDTO[], postId: string) {
    const paths: {
      imovelId: string;
      imageUrl: string;
      id:UUID
    }[] = [];

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
          const optimizedFile = await this.imagesOptmization(file);

          const urlUUID = randomUUID()
          const { data, error } = await supaclient.storage
            .from('images')
            .upload(
              `${postId}/${urlUUID}.webp`,
              optimizedFile,
              {
                contentType: 'image/webp',
                upsert: true,
              },
            );

          if (error) {
            throw error.message;
          }

          const path = `${supabaseUrl}/storage/v1/object/public/images/${postId}/${urlUUID}.webp`;
          paths.push({
            imovelId: postId,
            imageUrl: path,
            id:randomUUID()
          });
        }),
      );

      return paths;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}
