import { env } from '@/config/env';
import type { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

export class UploadMiddleware {
  private uploadDir: string;
  private maxFileSize: number;

  constructor() {
    this.uploadDir = env.uploadPath || './uploads';
    this.maxFileSize = env.maxFileSize || 1024 * 1024 * 5; // 5MB default

    // ensure updload directory exists
    this.ensureUploadDir();
  }

  // ensure updload
  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // configure storage for multer
  private getStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: (
        req: Request,
        _file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
      ) => {
        cb(null, this.uploadDir);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
      ) => {
        // generate unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const sanitizeBasename = basename.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${sanitizeBasename}-${uniqueSuffix}${ext}`);
      },
    });
  }

  // file filter to validate uploaded files
  private fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    // Allowed file types
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    const allowedExtension = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtension.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP are allowed.'));
    }
  }

  // get multer upload middleware for single files
  single(_fieldName: string): multer.Multer {
    return multer({
      storage: this.getStorage(),
      fileFilter: this.fileFilter.bind(this),
      limits: {
        fileSize: this.maxFileSize,
      },
    });
  }

  // get multer upload middleware for multiple files
  multiple(_fieldName: string, maxCount = 5): multer.Multer {
    return multer({
      storage: this.getStorage(),
      fileFilter: this.fileFilter.bind(this),
      limits: {
        fileSize: this.maxFileSize,
        files: maxCount,
      },
    });
  }

  // delete uploaded file
  static deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // check if file exists
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}

export const uploadMiddleware = new UploadMiddleware();
