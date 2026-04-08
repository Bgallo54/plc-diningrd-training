import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield, Users, CheckCircle2, AlertCircle, Award,
  BarChart3, TrendingUp, Download, Filter, Building2,
} from "lucide-react";
import type { AssessmentResult } from "@shared/schema";

export default function ManagerDashboard() {
  const [communityFilter, setCommunityFilter] = useState<string>("all");

  const { data: assessments = [] } = useQuery<AssessmentResult[]>({
    queryKey: ["/api/assessments"],
  });

  // Extract unique communities from assessment data
  const activeCommunities = useMemo(() => {
    const communities = new Set<string>();
    assessments.forEach(a => {
      if ((a as any).community) communities.add((a as any).community);
    });
    return Array.from(communities).sort();
  }, [assessments]);

  // Filtered assessments
  const filteredAssessments = useMemo(() => {
    if (communityFilter === "all") return assessments;
    return assessments.filter(a => (a as any).community === communityFilter);
  }, [assessments, communityFilter]);

  // Stats
  const uniqueNames = new Set(filteredAssessments.map(a => a.staffName.toLowerCase().trim()));
  const totalAssessed = uniqueNames.size;
  const uniquePassed = new Set(
    filteredAssessments.filter(a => a.passed).map(a => a.staffName.toLowerCase().trim())
  ).size;
  const avgScore = filteredAssessments.length > 0
    ? Math.round(filteredAssessments.reduce((sum, a) => sum + a.scorePercent, 0) / filteredAssessments.length)
    : 0;
  const passRate = filteredAssessments.length > 0
    ? Math.round((filteredAssessments.filter(a => a.passed).length / filteredAssessments.length) * 100)
    : 0;

  // Community breakdown
  const communityBreakdown = useMemo(() => {
    if (communityFilter !== "all") return [];
    const map = new Map<string, { total: number; passed: number; scores: number[] }>();
    assessments.forEach(a => {
      const comm = (a as any).community;
      if (!comm) return;
      if (!map.has(comm)) map.set(comm, { total: 0, passed: 0, scores: [] });
      const entry = map.get(comm)!;
      entry.total++;
      entry.scores.push(a.scorePercent);
      if (a.passed) entry.passed++;
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        total: data.total,
        passed: data.passed,
        avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
        passRate: Math.round((data.passed / data.total) * 100),
      }))
      .sort((a, b) => b.passRate - a.passRate || a.name.localeCompare(b.name));
  }, [assessments, communityFilter]);

  function exportCSV() {
    const rows = [["Name", "Title", "Community", "Score", "Result", "Certificate ID", "Date"]];
    filteredAssessments.forEach(r => {
      rows.push([
        r.staffName,
        (r as any).staffTitle || "",
        (r as any).community || "",
        `${r.scorePercent}% (${r.score}/${r.totalQuestions})`,
        r.passed ? "Passed" : "Needs Review",
        r.certificateId || "",
        new Date(r.completedAt).toLocaleDateString(),
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plc-diningrd-results-${communityFilter === "all" ? "all" : communityFilter.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold" data-testid="text-manager-title">Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track assessment scores and certification progress across your DiningRD training program.
          </p>
        </div>
      </div>

      {/* Community filter */}
      {activeCommunities.length > 0 && (
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium shrink-0">
                <Filter className="w-4 h-4 text-primary" />
                Filter by Community
              </div>
              <Select value={communityFilter} onValueChange={setCommunityFilter}>
                <SelectTrigger className="sm:max-w-xs" data-testid="select-community-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  <SelectItem value="all">All Communities</SelectItem>
                  {activeCommunities.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {communityFilter !== "all" && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setCommunityFilter("all")}>
                  Clear filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold" data-testid="stat-assessed">{totalAssessed}</div>
            <div className="text-xs text-muted-foreground">Assessed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-600">{uniquePassed}</div>
            <div className="text-xs text-muted-foreground">Certified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">{avgScore > 0 ? `${avgScore}%` : "—"}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">{passRate > 0 ? `${passRate}%` : "—"}</div>
            <div className="text-xs text-muted-foreground">Pass Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Community breakdown (only when viewing all and multiple communities exist) */}
      {communityFilter === "all" && communityBreakdown.length > 1 && (
        <div>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Results by Community
          </h2>
          <div className="space-y-2">
            {communityBreakdown.map(c => (
              <Card
                key={c.name}
                className="bg-card hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => setCommunityFilter(c.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      c.passRate === 100 ? "bg-green-500" : c.passRate > 0 ? "bg-primary" : "bg-orange-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.passed}/{c.total} passed · Avg {c.avgScore}%
                      </div>
                    </div>
                    <Progress value={c.passRate} className="h-1.5 w-20 shrink-0" />
                    <span className={`text-sm font-semibold shrink-0 ${
                      c.passRate === 100 ? "text-green-600" : c.passRate > 0 ? "text-primary" : "text-orange-500"
                    }`}>
                      {c.passRate}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Export */}
      {filteredAssessments.length > 0 && (
        <div className="flex">
          <Button variant="outline" size="sm" onClick={exportCSV} data-testid="button-export-csv">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      )}

      {/* Assessment results table */}
      <div>
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Assessment Results
          {communityFilter !== "all" && (
            <Badge variant="secondary" className="text-[10px] font-normal">{communityFilter}</Badge>
          )}
        </h2>

        {filteredAssessments.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">No assessment results yet</p>
              <p className="text-xs text-muted-foreground">
                Results will appear here as team members complete the Knowledge Checks.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-assessments">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Community</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map(result => (
                    <tr key={result.id} className="border-b last:border-b-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{result.staffName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{(result as any).staffTitle || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{(result as any).community || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${result.passed ? "text-green-600" : "text-orange-500"}`}>
                          {result.scorePercent}%
                        </span>
                        <span className="text-muted-foreground ml-1 text-xs">({result.score}/{result.totalQuestions})</span>
                      </td>
                      <td className="px-4 py-3">
                        {result.passed ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                            <Award className="w-2.5 h-2.5 mr-0.5" />
                            Passed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] text-orange-600">Needs Review</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(result.completedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {result.certificateId || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
