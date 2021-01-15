import { Controller, Get, Render, Response } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('index')
  @Get()
  public index() {
    return {};
  }

  @Render('register')
  @Get('/register')
  public register() {
    return {};
  }

  @Render('login')
  @Get('/login')
  public login(@Response({ passthrough: true }) res: any) {
    return {};
  }
}
