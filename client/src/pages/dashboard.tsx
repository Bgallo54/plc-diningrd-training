import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { modules, getTotalLessons } from "@/lib/training-data";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, Play, FileText, Users, Target, Heart, BookOpen, UtensilsCrossed, ClipboardList, Tablet, ClipboardCheck } from "lucide-react";
import type { TrainingProgress } from "@shared/schema";
import plcLogo from "@assets/plc-logo.jpg";

const iconMap: Record<string, any> = {
  Home: GraduationCap, UtensilsCrossed, ClipboardList, Tablet, BookOpen,
};

export default function Dashboard() {
  const { data: progress = [] } = useQuery<TrainingProgress[]>({ queryKey: ["/api/progress"] });

  const completedSet = new Set(progress.filter(p => p.completed).map(p => `${p.moduleId}:${p.lessonId}`));
  const totalLessons = getTotalLessons();
  const completedCount = completedSet.size;
  const overallPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 lg:p-8 text-primary-foreground">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <img src={plcLogo} alt="PLC" className="w-12 h-12 rounded-xl object-cover bg-white/20 p-0.5" />
              <div>
                <h1 className="text-xl font-bold leading-tight" data-testid="text-dashboard-title">DiningRD Training Platform</h1>
                <p className="text-sm opacity-80">Priority Life Care — Dining Services</p>
              </div>
            </div>
            <p className="text-sm opacity-90 max-w-xl leading-relaxed mt-3">
              This training platform equips your dining team to deliver exceptional, personalized meals to every resident. 
              Master each DiningRD module to streamline operations, reduce errors, and create a dining experience residents love.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-5 min-w-[200px]">
            <div className="text-center">
              <div className="text-3xl font-bold">{overallPercent}%</div>
              <div className="text-xs opacity-70 mt-1">Overall Progress</div>
              <Progress value={overallPercent} className="mt-3 h-2 bg-white/20" />
              <div className="text-xs opacity-60 mt-2">{completedCount} of {totalLessons} lessons</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <Card className="border-l-4 border-l-primary bg-card">
        <CardContent className="p-5 flex gap-4 items-start">
          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm mb-1">Our Dining Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At Priority Life Care, dining is more than a service — it is an opportunity to nourish, connect, and delight every resident.
              This platform ensures every team member has the training and tools to deliver exceptional, person-centered dining experiences 
              that honor individual preferences, dietary needs, and the dignity of choice.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: "Modules", value: modules.length, color: "text-primary" },
          { icon: Play, label: "Video Lessons", value: modules.reduce((s, m) => s + m.lessons.filter(l => l.type === "video").length, 0), color: "text-orange-500" },
          { icon: FileText, label: "PDF Guides", value: modules.reduce((s, m) => s + m.lessons.filter(l => l.type === "pdf").length, 0), color: "text-purple-500" },
          { icon: Target, label: "Completed", value: completedCount, color: "text-green-500" },
        ].map(stat => (
          <Card key={stat.label} className="bg-card">
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Module Cards */}
      <div>
        <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
          <GraduationCap className="w-5 h-5 text-primary" />
          Training Modules
        </h2>
        <div className="grid gap-3">
          {modules.map(mod => {
            const Icon = iconMap[mod.icon] || BookOpen;
            const modCompleted = mod.lessons.filter(l => completedSet.has(`${mod.id}:${l.id}`)).length;
            const modPercent = mod.lessons.length > 0 ? Math.round((modCompleted / mod.lessons.length) * 100) : 0;
            return (
              <Link key={mod.id} href={`/module/${mod.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group bg-card" data-testid={`card-module-${mod.id}`}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{mod.title}</h3>
                        <Badge variant="secondary" className="text-[10px] shrink-0">{mod.lessons.length} {mod.lessons.length === 1 ? 'lesson' : 'lessons'}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{mod.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Progress value={modPercent} className="h-1.5 flex-1 max-w-[200px]" />
                        <span className="text-[11px] text-muted-foreground font-medium">{modPercent}%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Resident Customization CTA */}
      <Link href="/resident-guide">
        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20 hover:shadow-md transition-shadow cursor-pointer" data-testid="card-resident-guide">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Customizing Dining to Resident Needs</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Learn how DiningRD's tools work together to deliver truly personalized, person-centered dining at your community.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary/50" />
          </CardContent>
        </Card>
      </Link>

      {/* Knowledge Checks CTA */}
      <Link href="/knowledge-checks">
        <Card className="bg-gradient-to-r from-orange-500/5 to-transparent border-orange-500/20 hover:shadow-md transition-shadow cursor-pointer" data-testid="card-knowledge-checks">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Knowledge Checks</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Test your understanding with a comprehensive assessment covering all training modules. 80% required to pass.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-500/50" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
