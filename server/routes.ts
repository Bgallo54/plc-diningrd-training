import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export function registerRoutes(server: Server, app: Express) {
  // Training progress
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

  // Staff members
  app.get("/api/staff", (_req, res) => {
    const staff = storage.getStaffMembers();
    res.json(staff);
  });

  app.post("/api/staff", (req, res) => {
    const { name, role, community } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: "name and role required" });
    }
    const member = storage.addStaffMember({
      name,
      role,
      community: community || "",
      addedAt: new Date().toISOString(),
    });
    res.json(member);
  });

  app.delete("/api/staff/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    storage.removeStaffMember(id);
    res.json({ success: true });
  });

  // Assessment results
  app.get("/api/assessments", (_req, res) => {
    const results = storage.getAssessmentResults();
    res.json(results);
  });

  app.post("/api/assessments", (req, res) => {
    const { staffId, staffName, score, totalQuestions, scorePercent, passed } = req.body;
    if (!staffName || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: "staffName, score, and totalQuestions required" });
    }
    const certificateId = passed ? `PLC-DR-${Date.now().toString(36).toUpperCase()}` : null;
    const result = storage.addAssessmentResult({
      staffId: staffId || 0,
      staffName,
      score,
      totalQuestions,
      scorePercent,
      passed: !!passed,
      completedAt: new Date().toISOString(),
      certificateId,
    });
    res.json(result);
  });
}
