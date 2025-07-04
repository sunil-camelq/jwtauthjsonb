import { db } from 'src/db/db.connection';
import { tasks, employees } from 'src/schema/schema';
import { eq, sql, and, gte, lte, between } from 'drizzle-orm';
import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';

@Injectable()
export class TaskService {
  async assignTask(body: any, user: any) {
    if (user.role !== 'team_lead') {
      throw new ForbiddenException('Only team leads can assign tasks');
    }

    // Get all employees under this team lead
    const teamMembers = await db
      .select()
      .from(employees)
      .where(eq(employees.teamLead, user.id));

    const employeeIds = teamMembers.map(emp => emp.id);

    if (employeeIds.length === 0) {
      throw new ForbiddenException('No employees under your team');
    }

    const [task] = await db.insert(tasks).values({
      title: body.title,
      description: body.description,
      assignedTo: employeeIds,
      assignedBy: user.id,
    }).returning();

    return { message: 'Task assigned to multiple employees', task };
  }

  async getTasksForUser(user: any) {
    if (user.role === 'employee') {
      const taskList = await db
        .select()
        .from(tasks)
        .where(sql`${tasks.assignedTo} @> ${JSON.stringify([user.id])}`);

      return { tasks: taskList };
    } else if (user.role === 'team_lead') {
      const taskList = await db
        .select({ title: tasks.title, description: tasks.description })
        .from(tasks)
        .where(eq(tasks.assignedBy, user.id));

      return { tasks: taskList };
    } else {
      return { message: 'Managers do not have task data access' };
    }
  }


  async getTasksByDate(from: string, to: string) {
    if (!from || !to) {
      throw new BadRequestException('Please provide both from and to dates');
    }

    const taskList = await db
      .select()
      .from(tasks)
      .where(between(tasks.createdAt, new Date(from), new Date(to)));

    return { count: taskList.length, tasks: taskList };
  }

  async getTasksByTime(fromTime: string, toTime: string) {
    if (!fromTime || !toTime) {
      throw new BadRequestException('Please provide both from and to times (HH:mm:ss)');
    }

    const result = await db.execute(sql`
      SELECT * FROM tasks
      WHERE to_char(created_at, 'HH24:MI:SS') BETWEEN ${fromTime} AND ${toTime}
    `);

    return {
      count: result.rows.length,
      tasks: result.rows,
    };
  }
  
 
}
