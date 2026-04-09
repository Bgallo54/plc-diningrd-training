import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trainingProgress = sqliteTable("training_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: text("module_id").notNull(),
  lessonId: text("lesson_id").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),
});

export const staffMembers = sqliteTable("staff_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  community: text("community").notNull().default(""),
  addedAt: text("added_at").notNull(),
});

export const assessmentResults = sqliteTable("assessment_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  staffId: integer("staff_id").notNull(),
  staffName: text("staff_name").notNull(),
  staffTitle: text("staff_title").notNull().default(""),
  community: text("community").notNull().default(""),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  scorePercent: integer("score_percent").notNull(),
  passed: integer("passed", { mode: "boolean" }).notNull(),
  completedAt: text("completed_at").notNull(),
  certificateId: text("certificate_id"),
  sectionBreakdown: text("section_breakdown"),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  pin: text("pin").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull(),
});

export const insertTrainingProgressSchema = createInsertSchema(trainingProgress).omit({ id: true });
export type InsertTrainingProgress = z.infer<typeof insertTrainingProgressSchema>;
export type TrainingProgress = typeof trainingProgress.$inferSelect;

export const insertStaffMemberSchema = createInsertSchema(staffMembers).omit({ id: true });
export type InsertStaffMember = z.infer<typeof insertStaffMemberSchema>;
export type StaffMember = typeof staffMembers.$inferSelect;

export const insertAssessmentResultSchema = createInsertSchema(assessmentResults).omit({ id: true });
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type AssessmentResult = typeof assessmentResults.$inferSelect;

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true });
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
