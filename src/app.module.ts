import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiClientModule } from './infra/gemini-client/gemini-client.module';

@Module({
  imports: [GeminiClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
