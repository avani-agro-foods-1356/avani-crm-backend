import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactsService } from './contacts.service';
import { Prisma } from '@prisma/client';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactDto: Prisma.ContactCreateInput) {
    return this.contactsService.create(createContactDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.contactsService.processCsv(file.buffer);
  }

  @Post('bulk-message')
  async sendBulkMessage(@Body() body: { message: string, mediaType?: string, mediaUrl?: string }) {
    return this.contactsService.sendBulkMessage(body.message, body.mediaType, body.mediaUrl);
  }

  @Post('direct-message')
  async sendDirectMessage(@Body() body: { phone: string, message: string, mediaType?: string, mediaUrl?: string, templateParams?: string[] }) {
    return this.contactsService.sendDirectMessage(body.phone, body.message, body.mediaType, body.mediaUrl, body.templateParams);
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: Prisma.ContactUpdateInput) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
