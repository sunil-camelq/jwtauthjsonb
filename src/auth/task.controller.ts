import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { TaskService } from '../auth/task.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('assign')
  @Roles('team_lead')
  assignTask(@Body() body: any, @Request() req: any) {
    return this.taskService.assignTask(body, req.user);
  }

  @Get()
  @Roles('employee', 'team_lead')
  getTasks(@Request() req: any) {
    return this.taskService.getTasksForUser(req.user);
  }
}
