import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield, Users, UserPlus, Trash2, Trophy, AlertCircle,
  CheckCircle2, Clock, Award, ChevronDown, ChevronRight,
  BarChart3, TrendingUp, Download, Filter, Building2,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { StaffMember, AssessmentResult } from "@shared/schema";
import { getCommunityOptions } from "@/lib/plc-communities";

const ROLES = [
  "Dining Services Director",
  "Dietary Manager",
  "Head Cook / Chef",
  "Cook",
  "Dining Service Aide",
  "Server",
  "Dietitian / RD",
  "Other",
];

export default function ManagerDashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newCommunity, setNewCommunity] = useState("");
  const [expandedStaff, setExpandedStaff] = useState<number | null>(null);
  const [communityFilter, setCommunityFilter] = useState<string>("all");

  const communityOptions = getCommunityOptions();

  const { data: staff = [] } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
  });

  const { data: assessments = [] } = useQuery<AssessmentResult[]>({
    queryKey: ["/api/assessments"],
  });

  const addStaffMutation = useMutation({
    mutationFn: async () => {
      const resp = await apiRequest("POST", "/api/staff", {
        name: newName.trim(),
        role: newRole,
        community: newCommunity,
      });
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setNewName("");
      setNewRole("");
      setNewCommunity("");
      setShowAddForm(false);
    },
  });

  const removeStaffMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    },
  });

  // Get unique communities that have staff or assessments
  const activeCommunities = useMemo(() => {
    const communities = new Set<string>();
    staff.forEach(s => { if (s.community) communities.add(s.community); });
    assessments.forEach(a => {
      // community might be in staffName format or separate
      const match = staff.find(s => s.name.toLowerCase().trim() === a.staffName.toLowerCase().trim());
      if (match?.community) communities.add(match.community);
    });
    return Array.from(communities).sort();
  }, [staff, assessments]);

  // Filtered data
  const filteredStaff = useMemo(() => {
    if (communityFilter === "all") return staff;
    return staff.filter(s => s.community === communityFilter);
  }, [staff, communityFilter]);

  const filteredAssessments = useMemo(() => {
    if (communityFilter === "all") return assessments;
    // Match assessments to staff community
    const staffInCommunity = new Set(
      staff.filter(s => s.community === communityFilter).map(s => s.name.toLowerCase().trim())
    );
    return assessments.filter(a => staffInCommunity.has(a.staffName.toLowerCase().trim()));
  }, [assessments, communityFilter, staff]);

  // Per-staff assessment data
  const staffAssessmentMap = useMemo(() => {
    const map = new Map<string, AssessmentResult[]>();
    assessments.forEach((a) => {
      const key = a.staffName.toLowerCase().trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return map;
  }, [assessments]);

  // Stats (filtered)
  const totalStaff = filteredStaff.length;
  const uniquePassed = new Set(
    filteredAssessments.filter(a => a.passed).map(a => a.staffName.toLowerCase().trim())
  ).size;
  const avgScore = filteredAssessments.length > 0
    ? Math.round(filteredAssessments.reduce((sum, a) => sum + a.scorePercent, 0) / filteredAssessments.length)
    : 0;
  const completionRate = totalStaff > 0 ? Math.round((uniquePassed / totalStaff) * 100) : 0;

  function getStaffAssessments(name: string): AssessmentResult[] {
    return staffAssessmentMap.get(name.toLowerCase().trim()) || [];
  }

  function getBestScore(name: string): AssessmentResult | null {
    const results = getStaffAssessments(name);
    if (results.length === 0) return null;
    return results.reduce((best, r) => r.scorePercent > best.scorePercent ? r : best, results[0]);
  }

  function exportCSV() {
    const rows = [["Name", "Role", "Community", "Best Score", "Passed", "Certificate ID", "Last Attempt"]];
    filteredStaff.forEach(s => {
      const best = getBestScore(s.name);
      rows.push([
        s.name,
        s.role,
        s.community,
        best ? `${best.scorePercent}%` : "Not taken",
        best?.passed ? "Yes" : "No",
        best?.certificateId || "",
        best ? new Date(best.completedAt).toLocaleDateString() : "",
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plc-diningrd-roster-${communityFilter === "all" ? "all" : communityFilter.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Community breakdown for the summary section
  const communityBreakdown = useMemo(() => {
    if (communityFilter !== "all") return [];
    const map = new Map<string, { total: number; passed: number; avgScore: number; scores: number[] }>();
    staff.forEach(s => {
      if (!s.community) return;
      if (!map.has(s.community)) map.set(s.community, { total: 0, passed: 0, avgScore: 0, scores: [] });
      const entry = map.get(s.community)!;
      entry.total++;
      const best = getBestScore(s.name);
      if (best) {
        entry.scores.push(best.scorePercent);
        if (best.passed) entry.passed++;
      }
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        total: data.total,
        passed: data.passed,
        avgScore: data.scores.length > 0 ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0,
        completionRate: Math.round((data.passed / data.total) * 100),
      }))
      .sort((a, b) => b.completionRate - a.completionRate || a.name.localeCompare(b.name));
  }, [staff, communityFilter, staffAssessmentMap]);

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
            Track your team's training progress and assessment scores across DiningRD modules.
          </p>
        </div>
      </div>

      {/* Community filter */}
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold" data-testid="stat-total-staff">{totalStaff}</div>
            <div className="text-xs text-muted-foreground">Team Members</div>
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
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Team completion progress */}
      {totalStaff > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">
                {communityFilter === "all" ? "Team" : communityFilter} Certification Progress
              </span>
              <span className="text-xs text-muted-foreground">{uniquePassed} of {totalStaff} certified</span>
            </div>
            <Progress value={completionRate} className="h-2.5" />
          </CardContent>
        </Card>
      )}

      {/* Community breakdown (only when viewing all) */}
      {communityFilter === "all" && communityBreakdown.length > 1 && (
        <div>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Progress by Community
          </h2>
          <div className="space-y-2">
            {communityBreakdown.map(c => (
              <Card
                key={c.name}
                className="bg-card hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => setCommunityFilter(c.name)}
                data-testid={`community-card-${c.name.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      c.completionRate === 100 ? "bg-green-500" : c.completionRate > 0 ? "bg-primary" : "bg-gray-300"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.passed}/{c.total} certified
                        {c.avgScore > 0 && <span> · Avg {c.avgScore}%</span>}
                      </div>
                    </div>
                    <Progress value={c.completionRate} className="h-1.5 w-20 shrink-0" />
                    <span className={`text-sm font-semibold shrink-0 ${
                      c.completionRate === 100 ? "text-green-600" : c.completionRate > 0 ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {c.completionRate}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add staff + actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} data-testid="button-add-staff">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Add Team Member
        </Button>
        {filteredStaff.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportCSV} data-testid="button-export-csv">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Add staff form */}
      {showAddForm && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Add Team Member</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="add-name" className="text-xs mb-1 block">Full Name</Label>
                <Input
                  id="add-name"
                  placeholder="e.g. Jane Smith"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  data-testid="input-add-name"
                />
              </div>
              <div>
                <Label htmlFor="add-role" className="text-xs mb-1 block">Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger id="add-role" data-testid="select-add-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="add-community" className="text-xs mb-1 block">Community</Label>
                <Select value={newCommunity} onValueChange={setNewCommunity}>
                  <SelectTrigger id="add-community" data-testid="select-add-community">
                    <SelectValue placeholder="Select community" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    {communityOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => addStaffMutation.mutate()}
                disabled={!newName.trim() || !newRole || !newCommunity || addStaffMutation.isPending}
                data-testid="button-save-staff"
              >
                {addStaffMutation.isPending ? "Adding..." : "Add Member"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team roster */}
      <div>
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Team Roster
          {communityFilter !== "all" && (
            <Badge variant="secondary" className="text-[10px] font-normal">{communityFilter}</Badge>
          )}
        </h2>

        {filteredStaff.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="p-8 text-center">
              <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">
                {communityFilter !== "all" ? `No team members at ${communityFilter}` : "No team members added yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {communityFilter !== "all" ? "Try a different community filter or add team members." : "Add your dining team members above to track their training progress."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredStaff.map(member => {
              const best = getBestScore(member.name);
              const allResults = getStaffAssessments(member.name);
              const hasPassed = best?.passed;
              const isExpanded = expandedStaff === member.id;

              return (
                <Card key={member.id} className="overflow-hidden" data-testid={`staff-row-${member.id}`}>
                  <button
                    onClick={() => setExpandedStaff(isExpanded ? null : member.id)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors"
                  >
                    {/* Status indicator */}
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      hasPassed ? "bg-green-500" : best ? "bg-orange-400" : "bg-gray-300"
                    }`} />

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{member.name}</span>
                        {hasPassed && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] px-1.5 py-0">
                            <Award className="w-2.5 h-2.5 mr-0.5" />
                            Certified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                        {member.community && (
                          <>
                            <span className="text-xs text-muted-foreground/40">·</span>
                            <span className="text-xs text-muted-foreground">{member.community}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0 mr-2">
                      {best ? (
                        <>
                          <div className={`text-sm font-semibold ${hasPassed ? "text-green-600" : "text-orange-500"}`}>
                            {best.scorePercent}%
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {allResults.length} {allResults.length === 1 ? "attempt" : "attempts"}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Not taken
                        </div>
                      )}
                    </div>

                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t bg-muted/10 p-4">
                      {allResults.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-muted-foreground mb-2">Assessment History</div>
                          {allResults.map((result) => (
                            <div key={result.id} className="flex items-center gap-3 text-sm p-2.5 bg-background rounded-lg">
                              {result.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="font-medium">{result.scorePercent}%</span>
                                <span className="text-muted-foreground"> — {result.score}/{result.totalQuestions} correct</span>
                              </div>
                              <div className="text-xs text-muted-foreground shrink-0">
                                {new Date(result.completedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              {result.certificateId && (
                                <Badge variant="secondary" className="text-[9px] shrink-0">
                                  {result.certificateId}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          No assessment attempts yet. This team member needs to complete the Knowledge Checks.
                        </p>
                      )}
                      <div className="flex justify-end mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove ${member.name} from the roster?`)) {
                              removeStaffMutation.mutate(member.id);
                            }
                          }}
                          data-testid={`button-remove-${member.id}`}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* All assessment results */}
      {filteredAssessments.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Recent Assessment Results
            {communityFilter !== "all" && (
              <Badge variant="secondary" className="text-[10px] font-normal">{communityFilter}</Badge>
            )}
          </h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-assessments">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.slice(0, 20).map(result => (
                    <tr key={result.id} className="border-b last:border-b-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium">{result.staffName}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${result.passed ? "text-green-600" : "text-orange-500"}`}>
                          {result.scorePercent}%
                        </span>
                        <span className="text-muted-foreground ml-1">({result.score}/{result.totalQuestions})</span>
                      </td>
                      <td className="px-4 py-3">
                        {result.passed ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Passed</Badge>
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
        </div>
      )}
    </div>
  );
}
