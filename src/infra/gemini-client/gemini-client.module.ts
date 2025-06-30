import { Module } from '@nestjs/common';
import { GeminiClientService } from './services/gemini-client.service';

@Module({
  providers: [GeminiClientService],
  exports: [GeminiClientService],
})
export class GeminiClientModule {}
