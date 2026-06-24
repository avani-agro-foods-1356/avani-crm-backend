import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
    }
    const createData: any = { ...data };
    createData.workspace = { connect: { id: workspace.id } };
    return this.prisma.template.create({ data: createData });
  }

  findAll() {
    return this.prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
  }

  remove(id: string) {
    return this.prisma.template.delete({ where: { id } });
  }
}
