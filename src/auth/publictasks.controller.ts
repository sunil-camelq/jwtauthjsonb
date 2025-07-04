
import { Controller, Get, Query } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('public-tasks') // This route is now publicly accessible
export class PublicTaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('date')
  getTasksByDate(@Query('from') from: string, @Query('to') to: string) {
    return this.taskService.getTasksByDate(from, to);
  }

  @Get('time')
  getTasksByTime(@Query('from') from: string, @Query('to') to: string) {
    return this.taskService.getTasksByTime(from, to);
  }
}
