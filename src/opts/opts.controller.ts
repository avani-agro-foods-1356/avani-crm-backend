import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { OptsService } from './opts.service';

@Controller('opts')
export class OptsController {
  constructor(private readonly optsService: OptsService) {}

  @Get()
  findAll() {
    return this.optsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.optsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optsService.remove(id);
  }
}
