import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({ data: { name: 'Avani Loan Services Default' }});
    }
    const createData: any = { ...data };
    createData.workspace = { connect: { id: workspace.id } };
    return this.prisma.task.create({ data: createData });
  }

  findAll() {
    return this.prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
