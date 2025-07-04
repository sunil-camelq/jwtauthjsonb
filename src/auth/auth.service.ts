import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { db } from 'src/db/db.connection';
import { employees } from 'src/schema/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  async register(body: any) {
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const [user] = await db.insert(employees).values({
      username: body.username,
      password: hashedPassword,
      role: body.role,
      teamLead: body.teamLead || null,
    }).returning();
    return { message: 'User registered', user };
  }




  async login(body: any) {
    const [user] = await db.select().from(employees).where(eq(employees.username, body.username));
    if (!user) throw new NotFoundException('User not found');
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign({
      id: user.id,
      username: user.username,
      role: user.role,
    }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return { message: 'Login successful', user, token };
  }

  async getUsersBasedOnRole(user: any) {
    const { id, role } = user;
    if (role === 'manager') {
      const allUsers = await db.select().from(employees);
      return { role, users: allUsers };
    } else if (role === 'team_lead') {
      const teamEmployees = await db.select().from(employees).where(eq(employees.teamLead, id));
      return { role, teamEmployees };
    } else {
      const [self] = await db.select().from(employees).where(eq(employees.id, id));
      return { role, self };
    }
  }
}
