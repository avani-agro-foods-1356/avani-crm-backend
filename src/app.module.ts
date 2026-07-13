import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ContactsModule } from './contacts/contacts.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PrismaModule } from './prisma/prisma.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { TemplatesModule } from './templates/templates.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { GalleryModule } from './gallery/gallery.module';
import { FormsModule } from './forms/forms.module';
import { ColumnsModule } from './columns/columns.module';
import { OptsModule } from './opts/opts.module';
import { FaqModule } from './faq/faq.module';
import { AssistantModule } from './assistant/assistant.module';
import { FlowsModule } from './flows/flows.module';
import { SettingsModule } from './settings/settings.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { DevelopersModule } from './developers/developers.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlandModule } from './bland/bland.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: { extensions: ['html'] },
    }),
    PrismaModule, 
    WhatsappModule, 
    ContactsModule, 
    CampaignsModule, 
    TagsModule, 
    TasksModule, 
    ProjectsModule, 
    TemplatesModule, 
    WebhooksModule, 
    GalleryModule,
    FormsModule,
    ColumnsModule,
    OptsModule,
    FaqModule,
    AssistantModule,
    FlowsModule,
    SettingsModule,
    KnowledgeModule,
    DevelopersModule,
    BlandModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
