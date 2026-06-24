import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { DevelopersService } from './developers.service';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  findAll() {
    return this.developersService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.developersService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developersService.remove(id);
  }
}
