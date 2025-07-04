// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  controllers: [AuthController, TaskController],
  providers: [AuthService, TaskService],
})
export class AuthModule {}
