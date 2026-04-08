import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { modules } from "@/lib/training-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, FileText, ExternalLink, Heart, CheckCircle2, GraduationCap, BookOpen, UtensilsCrossed, ClipboardList, Tablet } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TrainingProgress } from "@shared/schema";
import { useState } from "react";

const iconMap: Record<string, any> = {
  Home: GraduationCap, UtensilsCrossed, ClipboardList, Tablet, BookOpen,
};

export default function ModulePage() {
  const params = useParams<{ id: string }>();
  const mod = modules.find(m => m.id === params.id);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const { data: progress = [] } = useQuery<TrainingProgress[]>({ queryKey: ["/api/progress"] });
  const completedSet = new Set(progress.filter(p => p.completed).map(p => `${p.moduleId}:${p.lessonId}`));

  const completeMutation = useMutation({
    mutationFn: (data: { moduleId: string; lessonId: string }) => apiRequest("POST", "/api/progress/complete", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  const incompleteMutation = useMutation({
    mutationFn: (data: { moduleId: string; lessonId: string }) => apiRequest("POST", "/api/progress/incomplete", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/progress"] }),
  });

  if (!mod) return <div className="p-8 text-center text-muted-foreground">Module not found.</div>;

  const Icon = iconMap[mod.icon] || BookOpen;
  const completedCount = mod.lessons.filter(l => completedSet.has(`${mod.id}:${l.id}`)).length;
  const percent = mod.lessons.length > 0 ? Math.round((completedCount / mod.lessons.length) * 100) : 0;

  function toggleLesson(lessonId: string) {
    const key = `${mod!.id}:${lessonId}`;
    if (completedSet.has(key)) {
      incompleteMutation.mutate({ moduleId: mod!.id, lessonId });
    } else {
      completeMutation.mutate({ moduleId: mod!.id, lessonId });
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Module Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold" data-testid={`text-module-title-${mod.id}`}>{mod.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{mod.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <Progress value={percent} className="h-2 flex-1 max-w-[300px]" />
            <span className="text-sm font-medium text-muted-foreground">{completedCount}/{mod.lessons.length} complete</span>
          </div>
        </div>
      </div>

      {/* Resident Benefit */}
      <Card className="border-l-4" style={{ borderLeftColor: mod.color }}>
        <CardContent className="p-4 flex gap-3 items-start">
          <Heart className="w-4 h-4 mt-0.5 shrink-0" style={{ color: mod.color }} />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: mod.color }}>
              How This Supports Our Residents
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{mod.residentBenefit}</p>
          </div>
        </CardContent>
      </Card>

      {/* Lessons */}
      <div className="space-y-3">
        <h2 className="font-semibold text-base flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary" />
          Lessons
        </h2>

        <Accordion type="single" collapsible value={activeVideo || undefined} onValueChange={(v) => setActiveVideo(v || null)}>
          {mod.lessons.map((lesson, idx) => {
            const isCompleted = completedSet.has(`${mod.id}:${lesson.id}`);
            return (
              <AccordionItem key={lesson.id} value={lesson.id} className="border rounded-lg mb-2 overflow-hidden bg-card">
                <AccordionTrigger className="px-4 py-3 hover:no-underline [&[data-state=open]]:bg-muted/50" data-testid={`trigger-lesson-${lesson.id}`}>
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="flex items-center gap-2 shrink-0">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(e) => {
                          e && typeof e === "object" && (e as any).stopPropagation?.();
                          toggleLesson(lesson.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`checkbox-${lesson.id}`}
                      />
                      <span className="text-xs text-muted-foreground font-mono w-5">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                          {lesson.title}
                        </span>
                        <Badge variant={lesson.type === "video" ? "default" : "secondary"} className="text-[10px] shrink-0">
                          {lesson.type === "video" ? <><Play className="w-2.5 h-2.5 mr-1" />Video</> : <><FileText className="w-2.5 h-2.5 mr-1" />PDF</>}
                        </Badge>
                        {lesson.duration && <span className="text-[10px] text-muted-foreground">{lesson.duration}</span>}
                      </div>
                    </div>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mr-2" />}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>

                    {/* Resident Impact */}
                    {lesson.residentImpact && (
                      <div className="flex gap-2 bg-primary/5 rounded-lg p-3">
                        <Heart className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                        <p className="text-xs text-muted-foreground italic">{lesson.residentImpact}</p>
                      </div>
                    )}

                    {/* Video embed */}
                    {lesson.type === "video" && lesson.loomEmbedId && (
                      <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          src={`https://www.loom.com/embed/${lesson.loomEmbedId}?hide_owner=true&hide_share=true&hide_title=true`}
                          frameBorder="0"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                          title={lesson.title}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <a href={lesson.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" data-testid={`button-open-${lesson.id}`}>
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Open in {lesson.type === "video" ? "Loom" : "New Tab"}
                        </Button>
                      </a>
                      <Button
                        variant={isCompleted ? "ghost" : "default"}
                        size="sm"
                        onClick={() => toggleLesson(lesson.id)}
                        data-testid={`button-complete-${lesson.id}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
