// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PublicTaskController } from './publictasks.controller';

@Module({
  controllers: [AuthController, TaskController, PublicTaskController],
  providers: [AuthService, TaskService],
})
export class AuthModule {}
