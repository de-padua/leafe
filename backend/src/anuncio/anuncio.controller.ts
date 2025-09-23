import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePropertyDto } from './dto/createAdDTO';
import { FileDTO, UploadFilesDTO } from './dto/fileUpload';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard, CustomRequestWithId } from 'src/auth/auth.guard';
import { AnuncioService } from './anuncio.service';
import { throws } from 'assert';

@Controller('anuncio')
export class AnuncioController {
  constructor(private readonly anuncioService: AnuncioService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createNewAd(
    @Req() request: CustomRequestWithId,
    @Body() body: CreatePropertyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!request.id) return HttpStatus.UNAUTHORIZED;

      const userId = request.id;

      const data = await this.anuncioService.createAd(
        body,
        body.postId,
        userId,
      );

      return {
        success: true,
        data: data,
      };
    } catch (err) {
      throw err;
    }
  }

  @Post('pictures')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Req() request: CustomRequestWithId,
    @UploadedFiles() files: FileDTO[],
    @Body() body: any,
  ) {
    try {
      if (!request.id) return HttpStatus.UNAUTHORIZED;
      const postId = Array.isArray(body.id) ? body.id[0] : body.id;
      const data = await this.anuncioService.uploadImages(files, postId);
      return {
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }
  @Post('teste')
  async teste() {
    return "ok"
  }
}
