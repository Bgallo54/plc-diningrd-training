import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export function registerRoutes(server: Server, app: Express) {
  app.get("/api/progress", (_req, res) => {
    const progress = storage.getProgress();
    res.json(progress);
  });

  app.post("/api/progress/complete", (req, res) => {
    const { moduleId, lessonId } = req.body;
    if (!moduleId || !lessonId) {
      return res.status(400).json({ error: "moduleId and lessonId required" });
    }
    const result = storage.markComplete(moduleId, lessonId);
    res.json(result);
  });

  app.post("/api/progress/incomplete", (req, res) => {
    const { moduleId, lessonId } = req.body;
    if (!moduleId || !lessonId) {
      return res.status(400).json({ error: "moduleId and lessonId required" });
    }
    storage.markIncomplete(moduleId, lessonId);
    res.json({ success: true });
  });
}
