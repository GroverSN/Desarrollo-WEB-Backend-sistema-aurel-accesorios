import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor() {
    const uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
        const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();

        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de archivo no permitido'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${file.fieldname}-${uniqueSuffix}.webp`;
    const outputPath = join(process.cwd(), 'uploads', filename);

    await sharp(file.buffer)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const stats = require('fs').statSync(outputPath);

    return {
      url: `/uploads/${filename}`,
      filename: filename,
      originalName: file.originalname,
      size: stats.size,
    };
  }
}