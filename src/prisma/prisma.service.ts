import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    
    // Create a default workspace if none exists
    const count = await this.workspace.count();
    if (count === 0) {
      await this.workspace.create({
        data: {
          name: 'Avani Loan Services',
        }
      });
      console.log('Default workspace created.');
    }
  }
}
