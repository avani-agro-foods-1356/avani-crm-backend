import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GalleryService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly dbPath = path.join(process.cwd(), 'gallery.json');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([]), 'utf8');
    }
  }

  findAll() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading gallery DB', e);
      return [];
    }
  }

  addFile(file: any, backendUrl: string) {
    try {
      const items = this.findAll();
      const filename = file.filename || file.originalname;
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        filename: filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${backendUrl}/gallery/files/${filename}`,
        createdAt: new Date().toISOString(),
      };
      items.unshift(newItem);
      fs.writeFileSync(this.dbPath, JSON.stringify(items, null, 2), 'utf8');
      return newItem;
    } catch (e) {
      console.error('Error adding file to gallery', e);
      throw e;
    }
  }

  remove(id: string) {
    try {
      const items = this.findAll();
      const index = items.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        const item = items[index];
        const filePath = path.join(this.uploadDir, item.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        items.splice(index, 1);
        fs.writeFileSync(this.dbPath, JSON.stringify(items, null, 2), 'utf8');
        return { success: true };
      }
      return { success: false, message: 'File not found' };
    } catch (e) {
      console.error('Error removing file from gallery', e);
      return { success: false, error: e.message };
    }
  }
}
