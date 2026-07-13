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
  
  // Automatically start localtunnel in background for stable connection
  console.log('Starting Localtunnel for WhatsApp Webhooks and API...');
  const tunnelProcess = exec('npx localtunnel --port 4000 --subdomain avaniloanservices');
  
  tunnelProcess.stdout?.on('data', (data) => {
    console.log(`[localtunnel] ${data.trim()}`);
  });
  
  tunnelProcess.stderr?.on('data', (data) => {
    console.error(`[localtunnel err] ${data.trim()}`);
  });
}
bootstrap();
