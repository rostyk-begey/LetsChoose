import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('index')
  @Get()
  public index() {
    return {};
  }

  @Render('blog')
  @Get('/blog')
  public blog() {
    return {};
  }

  @Render('login')
  @Get('/login')
  public login() {
    return {};
  }
}
