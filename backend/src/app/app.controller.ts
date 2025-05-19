import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello from NestJS Backend!';
  }

  @Get('api/message')
  getMessage(): { message: string } {
    return { message: 'Hello from the NestJS backend!' };
  }
}
