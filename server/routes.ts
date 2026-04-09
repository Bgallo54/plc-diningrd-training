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
    const { staffId, staffName, staffTitle, community, score, totalQuestions, scorePercent, passed, sectionBreakdown } = req.body;
    if (!staffName || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: "staffName, score, and totalQuestions required" });
    }
    const certificateId = passed ? `PLC-DR-${Date.now().toString(36).toUpperCase()}` : null;
    const result = storage.addAssessmentResult({
      staffId: staffId || 0,
      staffName,
      staffTitle: staffTitle || "",
      community: community || "",
      score,
      totalQuestions,
      scorePercent,
      passed: !!passed,
      completedAt: new Date().toISOString(),
      certificateId,
      sectionBreakdown: sectionBreakdown ? JSON.stringify(sectionBreakdown) : null,
    });
    res.json(result);
  });

  // Admin authentication
  app.post("/api/admin/login", (req, res) => {
    const { email, pin } = req.body;
    if (!email || !pin) {
      return res.status(400).json({ error: "email and pin required" });
    }
    const admin = storage.verifyAdmin(email, pin);
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Return admin info (excluding pin)
    const { pin: _pin, ...safeAdmin } = admin;
    res.json(safeAdmin);
  });

  // Admin management (requires super-admin verification via header)
  app.get("/api/admin/users", (req, res) => {
    const authEmail = req.headers["x-admin-email"] as string;
    const authPin = req.headers["x-admin-pin"] as string;
    const admin = storage.verifyAdmin(authEmail || "", authPin || "");
    if (!admin || admin.role !== "super-admin") {
      return res.status(403).json({ error: "Super-admin access required" });
    }
    const users = storage.getAdminUsers().map(({ pin, ...u }) => u);
    res.json(users);
  });

  app.post("/api/admin/users", (req, res) => {
    const authEmail = req.headers["x-admin-email"] as string;
    const authPin = req.headers["x-admin-pin"] as string;
    const admin = storage.verifyAdmin(authEmail || "", authPin || "");
    if (!admin || admin.role !== "super-admin") {
      return res.status(403).json({ error: "Super-admin access required" });
    }
    const { name, email, pin, role } = req.body;
    if (!name || !email || !pin) {
      return res.status(400).json({ error: "name, email, and pin required" });
    }
    const existing = storage.getAdminByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An admin with this email already exists" });
    }
    const newAdmin = storage.addAdminUser({
      name,
      email: email.toLowerCase().trim(),
      pin,
      role: role || "admin",
      createdAt: new Date().toISOString(),
    });
    const { pin: _pin, ...safe } = newAdmin;
    res.json(safe);
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    const authEmail = req.headers["x-admin-email"] as string;
    const authPin = req.headers["x-admin-pin"] as string;
    const admin = storage.verifyAdmin(authEmail || "", authPin || "");
    if (!admin || admin.role !== "super-admin") {
      return res.status(403).json({ error: "Super-admin access required" });
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
    // Prevent deleting yourself
    if (admin.id === id) {
      return res.status(400).json({ error: "Cannot remove yourself" });
    }
    storage.removeAdminUser(id);
    res.json({ success: true });
  });
}
