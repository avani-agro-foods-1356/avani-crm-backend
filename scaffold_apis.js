const fs = require('fs');

const resources = [
  { name: 'tags', cap: 'Tags', model: 'tag' },
  { name: 'tasks', cap: 'Tasks', model: 'task' },
  { name: 'projects', cap: 'Projects', model: 'project' }
];

resources.forEach(res => {
  const serviceCode = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ${res.cap}Service {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
    }
    const createData: any = { ...data };
    createData.workspace = { connect: { id: workspace.id } };
    return this.prisma.${res.model}.create({ data: createData });
  }

  findAll() {
    return this.prisma.${res.model}.findMany({ orderBy: { createdAt: 'desc' } });
  }

  remove(id: string) {
    return this.prisma.${res.model}.delete({ where: { id } });
  }
}
`;

  const controllerCode = `import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ${res.cap}Service } from './${res.name}.service';

@Controller('${res.name}')
export class ${res.cap}Controller {
  constructor(private readonly ${res.name}Service: ${res.cap}Service) {}

  @Post()
  create(@Body() data: any) {
    return this.${res.name}Service.create(data);
  }

  @Get()
  findAll() {
    return this.${res.name}Service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${res.name}Service.remove(id);
  }
}
`;

  const moduleCode = `import { Module } from '@nestjs/common';
import { ${res.cap}Service } from './${res.name}.service';
import { ${res.cap}Controller } from './${res.name}.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [${res.cap}Controller],
  providers: [${res.cap}Service],
})
export class ${res.cap}Module {}
`;

  fs.mkdirSync(`src/${res.name}`, { recursive: true });
  fs.writeFileSync(`src/${res.name}/${res.name}.service.ts`, serviceCode, 'utf8');
  fs.writeFileSync(`src/${res.name}/${res.name}.controller.ts`, controllerCode, 'utf8');
  fs.writeFileSync(`src/${res.name}/${res.name}.module.ts`, moduleCode, 'utf8');
});
