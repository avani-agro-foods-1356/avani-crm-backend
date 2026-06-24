import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  findAll() {
    return this.assistantService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.assistantService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistantService.remove(id);
  }
}
