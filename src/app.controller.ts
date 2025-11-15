import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string; endpoints: string[] } {
    return {
      message: this.appService.getHello(),
      endpoints: [
        'GET /users - Get all users',
        'GET /users/:id - Get user by ID',
        'POST /users - Create a new user',
        'PUT /users/:id - Update user',
        'DELETE /users/:id - Delete user',
      ],
    };
  }
}
