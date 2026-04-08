import {
  trainingProgress, type TrainingProgress,
  staffMembers, type StaffMember, type InsertStaffMember,
  assessmentResults, type AssessmentResult, type InsertAssessmentResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getProgress(): TrainingProgress[];
  markComplete(moduleId: string, lessonId: string): TrainingProgress;
  markIncomplete(moduleId: string, lessonId: string): void;
  getStaffMembers(): StaffMember[];
  addStaffMember(member: InsertStaffMember): StaffMember;
  removeStaffMember(id: number): void;
  getAssessmentResults(): AssessmentResult[];
  getAssessmentResultsByStaff(staffId: number): AssessmentResult[];
  addAssessmentResult(result: InsertAssessmentResult): AssessmentResult;
}

export class DatabaseStorage implements IStorage {
  getProgress(): TrainingProgress[] {
    return db.select().from(trainingProgress).all();
  }

  markComplete(moduleId: string, lessonId: string): TrainingProgress {
    const existing = db.select().from(trainingProgress)
      .where(and(eq(trainingProgress.moduleId, moduleId), eq(trainingProgress.lessonId, lessonId)))
      .get();

    if (existing) {
      db.update(trainingProgress)
        .set({ completed: true, completedAt: new Date().toISOString() })
        .where(eq(trainingProgress.id, existing.id))
        .run();
      return { ...existing, completed: true, completedAt: new Date().toISOString() };
    }

    return db.insert(trainingProgress).values({
      moduleId,
      lessonId,
      completed: true,
      completedAt: new Date().toISOString(),
    }).returning().get();
  }

  markIncomplete(moduleId: string, lessonId: string): void {
    db.delete(trainingProgress)
      .where(and(eq(trainingProgress.moduleId, moduleId), eq(trainingProgress.lessonId, lessonId)))
      .run();
  }

  getStaffMembers(): StaffMember[] {
    return db.select().from(staffMembers).all();
  }

  addStaffMember(member: InsertStaffMember): StaffMember {
    return db.insert(staffMembers).values(member).returning().get();
  }

  removeStaffMember(id: number): void {
    db.delete(staffMembers).where(eq(staffMembers.id, id)).run();
  }

  getAssessmentResults(): AssessmentResult[] {
    return db.select().from(assessmentResults).orderBy(desc(assessmentResults.completedAt)).all();
  }

  getAssessmentResultsByStaff(staffId: number): AssessmentResult[] {
    return db.select().from(assessmentResults)
      .where(eq(assessmentResults.staffId, staffId))
      .orderBy(desc(assessmentResults.completedAt))
      .all();
  }

  addAssessmentResult(result: InsertAssessmentResult): AssessmentResult {
    return db.insert(assessmentResults).values(result).returning().get();
  }
}

export const storage = new DatabaseStorage();
