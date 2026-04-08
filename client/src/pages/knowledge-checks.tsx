import { useState, useMemo } from "react";
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
import { plcCommunities } from "@/lib/plc-communities";
import {
  ClipboardCheck, CheckCircle2, XCircle, ChevronRight, ChevronDown,
  RotateCcw, Trophy, BookOpen, AlertCircle, Eye, ArrowRight, ArrowLeft, Award,
} from "lucide-react";
import { quizSections, getTotalQuestions, getPassingScore, type QuizQuestion } from "@/lib/quiz-data";
import { CompletionCertificate } from "@/components/completion-certificate";
import { apiRequest } from "@/lib/queryClient";

type QuizState = "intro" | "active" | "results";

export default function KnowledgeChecks() {
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [staffName, setStaffName] = useState("");
  const [staffTitle, setStaffTitle] = useState("");
  const [staffCommunity, setStaffCommunity] = useState("");
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateId, setCertificateId] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  const allQuestions = useMemo(() => quizSections.flatMap(s => s.questions), []);
  const totalQuestions = getTotalQuestions();
  const passingScore = getPassingScore();

  const flatQuestions = useMemo(() => {
    const flat: { question: QuizQuestion; sectionIdx: number; localIdx: number }[] = [];
    quizSections.forEach((section, si) => {
      section.questions.forEach((q, qi) => {
        flat.push({ question: q, sectionIdx: si, localIdx: qi });
      });
    });
    return flat;
  }, []);

  const currentFlatIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < currentSectionIdx; i++) {
      idx += quizSections[i].questions.length;
    }
    return idx + currentQuestionIdx;
  }, [currentSectionIdx, currentQuestionIdx]);

  const currentQuestion = flatQuestions[currentFlatIdx];
  const answeredCount = answers.size;

  function selectAnswer(questionId: string, optionIdx: number) {
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(questionId, optionIdx);
      return next;
    });
  }

  function goToNext() {
    if (currentFlatIdx < flatQuestions.length - 1) {
      const next = flatQuestions[currentFlatIdx + 1];
      setCurrentSectionIdx(next.sectionIdx);
      setCurrentQuestionIdx(next.localIdx);
    }
  }

  function goToPrev() {
    if (currentFlatIdx > 0) {
      const prev = flatQuestions[currentFlatIdx - 1];
      setCurrentSectionIdx(prev.sectionIdx);
      setCurrentQuestionIdx(prev.localIdx);
    }
  }

  const score = useMemo(() => {
    let correct = 0;
    allQuestions.forEach(q => {
      const selected = answers.get(q.id);
      if (selected === q.correctIndex) correct++;
    });
    return correct;
  }, [answers, allQuestions]);

  const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = scorePercent >= passingScore;

  async function submitQuiz() {
    setQuizState("results");
    setShowReview(false);
    const now = new Date().toISOString();
    setCompletedAt(now);

    // Build section breakdown for remediation tracking
    const sectionBreakdown = quizSections.map(section => {
      let correct = 0;
      section.questions.forEach(q => {
        if (answers.get(q.id) === q.correctIndex) correct++;
      });
      return {
        moduleId: section.moduleId,
        title: section.title,
        correct,
        total: section.questions.length,
        percent: Math.round((correct / section.questions.length) * 100),
      };
    });

    // Save assessment result to backend
    try {
      const resp = await apiRequest("POST", "/api/assessments", {
        staffId: 0,
        staffName: staffName.trim(),
        staffTitle: staffTitle,
        community: staffCommunity,
        score,
        totalQuestions,
        scorePercent,
        passed,
        sectionBreakdown,
      });
      const data = await resp.json();
      if (data.certificateId) {
        setCertificateId(data.certificateId);
      }
    } catch {
      // Generate certificate ID client-side as fallback
      setCertificateId(`PLC-DR-${Date.now().toString(36).toUpperCase()}`);
    }
  }

  function resetQuiz() {
    setAnswers(new Map());
    setCurrentSectionIdx(0);
    setCurrentQuestionIdx(0);
    setQuizState("intro");
    setShowReview(false);
    setShowCertificate(false);
    setExpandedSection(null);
    setCertificateId("");
  }

  const sectionScores = useMemo(() => {
    return quizSections.map(section => {
      let correct = 0;
      section.questions.forEach(q => {
        if (answers.get(q.id) === q.correctIndex) correct++;
      });
      return {
        ...section,
        correct,
        total: section.questions.length,
        percent: Math.round((correct / section.questions.length) * 100),
      };
    });
  }, [answers]);

  // INTRO STATE
  if (quizState === "intro") {
    const canStart = staffName.trim().length >= 2 && staffTitle.length > 0 && staffCommunity.length > 0;

    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="text-knowledge-checks-title">Knowledge Checks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Test your understanding of the DiningRD platform and ensure you're ready to deliver exceptional dining service.
            </p>
          </div>
        </div>

        {/* Name entry */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <div>
                <Label htmlFor="staff-name" className="text-sm font-semibold mb-2 block">Your Full Name</Label>
                <Input
                  id="staff-name"
                  placeholder="e.g. Sarah Johnson"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  data-testid="input-staff-name"
                />
              </div>
              <div>
                <Label htmlFor="staff-title" className="text-sm font-semibold mb-2 block">Your Title</Label>
                <Select value={staffTitle} onValueChange={setStaffTitle}>
                  <SelectTrigger id="staff-title" data-testid="select-staff-title">
                    <SelectValue placeholder="Select your title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regional Vice President">Regional Vice President</SelectItem>
                    <SelectItem value="Regional Director of Operations">Regional Director of Operations</SelectItem>
                    <SelectItem value="Executive Director">Executive Director</SelectItem>
                    <SelectItem value="Dining Services Director">Dining Services Director</SelectItem>
                    <SelectItem value="Dietary Manager">Dietary Manager</SelectItem>
                    <SelectItem value="Life Enrichment Director">Life Enrichment Director</SelectItem>
                    <SelectItem value="Memory Care Director">Memory Care Director</SelectItem>
                    <SelectItem value="Head Cook / Chef">Head Cook / Chef</SelectItem>
                    <SelectItem value="Cook">Cook</SelectItem>
                    <SelectItem value="Dining Service Aide">Dining Service Aide</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Dietitian / RD">Dietitian / RD</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="staff-community" className="text-sm font-semibold mb-2 block">Community Location</Label>
                <Select value={staffCommunity} onValueChange={setStaffCommunity}>
                  <SelectTrigger id="staff-community" data-testid="select-staff-community">
                    <SelectValue placeholder="Select your community" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    {plcCommunities.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              All fields are required and will appear on your completion certificate if you pass.
            </p>

            <h2 className="font-semibold text-sm mb-3">Assessment Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{totalQuestions}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{quizSections.length}</div>
                <div className="text-xs text-muted-foreground">Sections</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{passingScore}%</div>
                <div className="text-xs text-muted-foreground">Passing Score</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">~15</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This assessment covers all five DiningRD training modules plus resident customization principles.
              Score 80% or higher to earn your completion certificate.
            </p>
          </CardContent>
        </Card>

        {/* Section overview */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Sections Covered
          </h3>
          {quizSections.map((section) => (
            <Card key={section.moduleId} className="bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                <span className="text-sm flex-1">{section.title}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {section.questions.length} {section.questions.length === 1 ? "question" : "questions"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Button size="lg" onClick={() => setQuizState("active")} disabled={!canStart} data-testid="button-start-quiz">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Begin Assessment
          </Button>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ STATE
  if (quizState === "active" && currentQuestion) {
    const section = quizSections[currentQuestion.sectionIdx];
    const q = currentQuestion.question;
    const selectedAnswer = answers.get(q.id);

    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Progress header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              Question {currentFlatIdx + 1} of {totalQuestions}
            </span>
            <span className="text-xs text-muted-foreground">
              {answeredCount} answered
            </span>
          </div>
          <Progress value={((currentFlatIdx + 1) / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: section.color }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: section.color }}>
            {section.title}
          </span>
        </div>

        {/* Question card */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-5 lg:p-6">
              <h2 className="font-semibold text-base leading-relaxed mb-5" data-testid={`text-question-${q.id}`}>
                {q.question}
              </h2>

              <div className="space-y-2.5">
                {q.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(q.id, idx)}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all text-sm leading-relaxed
                        ${isSelected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-primary/30 hover:bg-muted/30 text-muted-foreground"
                        }
                      `}
                      data-testid={`option-${q.id}-${idx}`}
                    >
                      <div className="flex gap-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
                          ${isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/30"}
                        `}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {!isSelected && <span className="text-[10px] font-semibold">{String.fromCharCode(65 + idx)}</span>}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrev}
            disabled={currentFlatIdx === 0}
            data-testid="button-prev-question"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentFlatIdx < flatQuestions.length - 1 ? (
              <Button
                size="sm"
                onClick={goToNext}
                data-testid="button-next-question"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={submitQuiz}
                disabled={answeredCount < totalQuestions}
                data-testid="button-submit-quiz"
              >
                <ClipboardCheck className="w-3.5 h-3.5 mr-1.5" />
                Submit Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Unanswered warning on last question */}
        {currentFlatIdx === flatQuestions.length - 1 && answeredCount < totalQuestions && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Please answer all {totalQuestions} questions before submitting. You've answered {answeredCount} so far.</span>
          </div>
        )}

        {/* Question map */}
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Question Map</div>
            <div className="flex flex-wrap gap-1.5">
              {flatQuestions.map((fq, idx) => {
                const isCurrentQ = idx === currentFlatIdx;
                const isAnsweredQ = answers.has(fq.question.id);
                return (
                  <button
                    key={fq.question.id}
                    onClick={() => {
                      setCurrentSectionIdx(fq.sectionIdx);
                      setCurrentQuestionIdx(fq.localIdx);
                    }}
                    className={`
                      w-8 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center
                      ${isCurrentQ
                        ? "bg-primary text-primary-foreground"
                        : isAnsweredQ
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }
                    `}
                    data-testid={`qmap-${idx}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // RESULTS STATE
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Score hero */}
      <Card className={`overflow-hidden ${passed ? "border-green-200 dark:border-green-900" : "border-orange-200 dark:border-orange-900"}`}>
        <CardContent className="p-0">
          <div className={`p-6 lg:p-8 text-center ${passed ? "bg-green-50 dark:bg-green-950/30" : "bg-orange-50 dark:bg-orange-950/30"}`}>
            <div className={`inline-flex p-4 rounded-full mb-4 ${passed ? "bg-green-100 dark:bg-green-900/50" : "bg-orange-100 dark:bg-orange-900/50"}`}>
              {passed ? (
                <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            <div className={`text-4xl font-bold mb-1 ${passed ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"}`} data-testid="text-score">
              {scorePercent}%
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              {score} of {totalQuestions} correct
            </div>
            <div className={`text-sm font-medium ${passed ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}>
              {passed ? `Congratulations, ${staffName.split(" ")[0]} — you passed!` : `You need ${passingScore}% to pass. Review the material and try again.`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section breakdown */}
      <div>
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Score Breakdown by Section
        </h2>
        <div className="space-y-2">
          {sectionScores.map(section => (
            <Card key={section.moduleId} className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                  <span className="text-sm flex-1 font-medium">{section.title}</span>
                  <span className={`text-sm font-semibold ${section.percent === 100 ? "text-green-600 dark:text-green-400" : section.percent >= passingScore ? "text-primary" : "text-orange-600 dark:text-orange-400"}`}>
                    {section.correct}/{section.total}
                  </span>
                  <Progress value={section.percent} className="h-1.5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        {passed && certificateId && (
          <Button onClick={() => setShowCertificate(!showCertificate)} data-testid="button-toggle-cert">
            <Award className="w-4 h-4 mr-2" />
            {showCertificate ? "Hide Certificate" : "View Certificate"}
          </Button>
        )}
        <Button variant="outline" onClick={() => setShowReview(!showReview)} data-testid="button-toggle-answer-key">
          <Eye className="w-4 h-4 mr-2" />
          {showReview ? "Hide Answer Key" : "View Answer Key"}
        </Button>
        <Button variant="outline" onClick={resetQuiz} data-testid="button-retake-quiz">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
      </div>

      {/* Certificate */}
      {showCertificate && passed && certificateId && (
        <CompletionCertificate
          staffName={staffName}
          staffTitle={staffTitle}
          community={staffCommunity}
          scorePercent={scorePercent}
          score={score}
          totalQuestions={totalQuestions}
          completedAt={completedAt}
          certificateId={certificateId}
        />
      )}

      {/* Answer key review */}
      {showReview && (
        <div className="space-y-4" data-testid="answer-key-section">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            Answer Key
          </h2>

          {quizSections.map((section) => {
            const isExpanded = expandedSection === section.moduleId;
            return (
              <Card key={section.moduleId} className="overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.moduleId)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                  data-testid={`toggle-section-${section.moduleId}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                  <span className="text-sm font-semibold flex-1">{section.title}</span>
                  <Badge variant="secondary" className="text-[10px] mr-2">
                    {section.questions.filter(q => answers.get(q.id) === q.correctIndex).length}/{section.questions.length}
                  </Badge>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="border-t">
                    {section.questions.map((q, qIdx) => {
                      const userAnswer = answers.get(q.id);
                      const isCorrect = userAnswer === q.correctIndex;
                      return (
                        <div key={q.id} className="p-4 border-b last:border-b-0" data-testid={`review-${q.id}`}>
                          <div className="flex items-start gap-2 mb-3">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            )}
                            <div>
                              <span className="text-xs text-muted-foreground font-medium">Q{qIdx + 1}.</span>{" "}
                              <span className="text-sm font-medium">{q.question}</span>
                            </div>
                          </div>

                          <div className="ml-6 space-y-1.5 mb-3">
                            {q.options.map((opt, idx) => {
                              const isUserChoice = userAnswer === idx;
                              const isCorrectChoice = q.correctIndex === idx;
                              return (
                                <div
                                  key={idx}
                                  className={`
                                    text-sm px-3 py-2 rounded-md flex items-center gap-2
                                    ${isCorrectChoice
                                      ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                      : isUserChoice && !isCorrectChoice
                                        ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                        : "text-muted-foreground"
                                    }
                                  `}
                                >
                                  <span className="text-xs font-semibold w-5 shrink-0">{String.fromCharCode(65 + idx)}.</span>
                                  <span className="flex-1">{opt}</span>
                                  {isCorrectChoice && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-500" />}
                                  {isUserChoice && !isCorrectChoice && <XCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />}
                                </div>
                              );
                            })}
                          </div>

                          <div className="ml-6 bg-primary/5 rounded-lg p-3 flex gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
