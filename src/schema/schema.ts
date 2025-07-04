import { integer, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";


export const employees = pgTable('employees', {
    id: serial('id').primaryKey(),
    username: varchar('username', {length:255}).notNull(),
    password: varchar('password', {length:255}).notNull(),
    role: varchar('role', {length:255}).notNull(),
    teamLead: varchar('teamLead'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length:255}).notNull(),
    description: varchar('description', {length:255}).notNull(),
    assignedTo: jsonb('assignedTo').notNull(), 
    assignedBy: integer('assignedBy').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})