import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TranslateDto } from './translate.dto';

@Controller('translate')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('ai')
  async translateWithAi(@Body() body: TranslateDto) {
    return this.appService.translateWithAi(body);
  }

  @Post('code')
  async translateWithCode(@Body() body: TranslateDto) {
    return this.appService.translateWithCode(body);
  }
}
