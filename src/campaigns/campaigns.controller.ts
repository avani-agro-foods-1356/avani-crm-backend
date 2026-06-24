import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() data: any) {
    return this.campaignsService.create(data);
  }

  @Get()
  findAll() {
    return this.campaignsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
