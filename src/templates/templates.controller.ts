import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(@Body() data: any) {
    return this.templatesService.create(data);
  }

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }

  @Post('sync')
  syncFromMeta() {
    return this.templatesService.syncFromMeta();
  }
}
