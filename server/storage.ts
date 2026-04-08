import { trainingProgress, type TrainingProgress, type InsertTrainingProgress } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getProgress(): TrainingProgress[];
  markComplete(moduleId: string, lessonId: string): TrainingProgress;
  markIncomplete(moduleId: string, lessonId: string): void;
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
}

export const storage = new DatabaseStorage();
