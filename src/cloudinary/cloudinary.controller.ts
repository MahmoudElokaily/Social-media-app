// app.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
// ... other imports

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    return {
      message: 'Success',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        version: result.version,
        display_name: result.display_name,
        format: result.format,
        resource_type: result.resource_type,
      }
    }
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiImage(@UploadedFiles() files: Express.Multer.File[]) {
    const result = await this.cloudinaryService.uploadMultipleFiles(files);
    return {
      message: 'Success',
      data: result.map(r => {
        return {
          public_id: r.public_id,
          version: r.version,
          display_name: r.display_name,
          format: r.format,
          resource_type: r.resource_type,
        }
      })
    }
  }

}
