import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { exec } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', { exclude: ['whatsapp/webhook'] });
  app.enableCors();
  
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  
  // Automatically start Cloudflare Tunnel in background for stable connection
  console.log('Starting Cloudflare Tunnel for WhatsApp Webhooks and API...');
  const tunnelProcess = exec('cloudflared tunnel --url http://localhost:4000');
  
  tunnelProcess.stdout?.on('data', (data) => {
    console.log(`[cloudflared] ${data.trim()}`);
  });
  
  tunnelProcess.stderr?.on('data', (data) => {
    console.error(`[cloudflared err] ${data.trim()}`);
  });
}
bootstrap();
