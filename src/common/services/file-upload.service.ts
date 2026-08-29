import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import path, { extname, join, resolve } from 'path';

interface FileUploadOptions {
  destination: string;
  allowedTypes?: RegExp;
  maxSize?: number;
  allowedTypesMessage?: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);

  static getMulterConfig(option: FileUploadOptions) {
    const {
      destination,
      allowedTypes = /\.(jpg|jpeg|png)$/i,
      maxSize = 5 * 1024 * 1024,
      allowedTypesMessage = 'Only image files are allowed (jpg, jpeg, png)',
    } = option;

    return {
      storage: diskStorage({
        destination,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!allowedTypes.test(file.originalname)) {
          return cb(new BadRequestException(allowedTypesMessage), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: maxSize,
      },
    };
  }

  static getAvatarMulterConfig() {
    return this.getMulterConfig({
      destination: 'uploads/avatars',
    });
  }

  getFileUrl(fileName: string, subDir: string): string {
    return `${subDir}/${fileName}`;
  }

  getAvatarUrl(fileName: string) {
    return this.getFileUrl(fileName, 'uploads/avatars');
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
      this.logger.log(`File deleted: ${filePath}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteFileByName(fileName: string, uploadDir: string): Promise<void> {
    try {
      const safeFileName = path.basename(fileName);
      const resoalveUploadsDir = resolve(uploadDir);
      const safePath = join(resoalveUploadsDir, safeFileName);

      if (!safePath.startsWith(resoalveUploadsDir)) {
        this.logger.error(
          `Attempt to delete file outside of upload directory ${safePath}`,
        );
        return;
      }

      await unlink(safePath);
      this.logger.log(`File deleted: ${safePath}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteAvatarByName(fileName: string): Promise<void> {
    return this.deleteFileByName(fileName, 'uploads/avatars');
  }
}
