import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Zap, ArrowLeft, Plus, Trash2, GripVertical,
  CheckCircle2, HelpCircle, BarChart3, Image, Video, X, UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuizAssignmentModal, { type AssignmentCriteria } from "@/components/quiz/QuizAssignmentModal";

type QuestionType = "multiple" | "truefalse" | "poll";

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  choices: Choice[];
  timer: number;
  points: number;
  imageUrl: string;
  videoUrl: string;
}

const defaultChoices: Record<QuestionType, Choice[]> = {
  multiple: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  truefalse: [
    { text: "Vrai", isCorrect: true },
    { text: "Faux", isCorrect: false },
  ],
  poll: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
};

const QuizBuilder = () => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("Mon nouveau quiz");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "multiple",
      text: "",
      choices: [...defaultChoices.multiple],
      timer: 20,
      points: 100,
      imageUrl: "",
      videoUrl: "",
    },
  ]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleAssign = (criteria: AssignmentCriteria) => {
    console.log("Quiz assigned from builder:", criteria);
  };

  const addQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: Date.now().toString(),
      type,
      text: "",
      choices: [...defaultChoices[type].map((c) => ({ ...c }))],
      timer: 20,
      points: 100,
      imageUrl: "",
      videoUrl: "",
    };
    setQuestions([...questions, newQ]);
    setActiveQuestion(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const updateChoice = (qIndex: number, cIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex].text = text;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, cIndex: number) => {
    const updated = [...questions];
    updated[qIndex].choices = updated[qIndex].choices.map((c, i) => ({
      ...c,
      isCorrect: i === cIndex,
    }));
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    setActiveQuestion(Math.min(activeQuestion, updated.length - 1));
  };

  /** Extract a YouTube embed URL from various formats */
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
    }
    // If it's already a direct video URL (mp4 etc.), return as-is
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return url;
    return null;
  };

  const current = questions[activeQuestion];
  const answerColors = ["game-answer-1", "game-answer-2", "game-answer-3", "game-answer-4"];
  const hasMedia = current?.imageUrl || current?.videoUrl;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <Input
            className="bg-transparent border-none text-lg font-display font-semibold w-64 focus-visible:ring-0"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Prévisualiser</Button>
          <Button className="shadow-glow-primary">Sauvegarder</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Question list sidebar */}
        <aside className="w-56 bg-sidebar border-r border-sidebar-border overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {questions.map((q, i) => (
              <motion.button
                key={q.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setActiveQuestion(i)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors group ${
                  i === activeQuestion
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Q{i + 1}</span>
                  <div className="flex items-center gap-1">
                    {q.videoUrl && <Video className="w-3 h-3 opacity-60" />}
                    {q.imageUrl && <Image className="w-3 h-3 opacity-60" />}
                    {q.type === "multiple" && <CheckCircle2 className="w-3 h-3" />}
                    {q.type === "truefalse" && <HelpCircle className="w-3 h-3" />}
                    {q.type === "poll" && <BarChart3 className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-xs mt-1 truncate opacity-70">
                  {q.text || "Sans titre"}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>

          <div className="pt-2 space-y-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => addQuestion("multiple")}
            >
              <CheckCircle2 className="w-3 h-3" /> QCM
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => addQuestion("truefalse")}
            >
              <HelpCircle className="w-3 h-3" /> Vrai/Faux
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-xs"
              onClick={() => addQuestion("poll")}
            >
              <BarChart3 className="w-3 h-3" /> Sondage
            </Button>
          </div>
        </aside>

        {/* Main editor */}
        <main className="flex-1 p-8 overflow-y-auto">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">
                  Question {activeQuestion + 1}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {current.type === "multiple" && "· QCM"}
                    {current.type === "truefalse" && "· Vrai/Faux"}
                    {current.type === "poll" && "· Sondage"}
                  </span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeQuestion(activeQuestion)}
                  disabled={questions.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Question text */}
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <Input
                  className="text-xl font-display bg-transparent border-none text-center placeholder:text-muted-foreground focus-visible:ring-0"
                  placeholder="Tapez votre question ici..."
                  value={current.text}
                  onChange={(e) => updateQuestion(activeQuestion, { text: e.target.value })}
                />

                {/* Media preview */}
                {hasMedia && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted/30">
                    {current.videoUrl && (() => {
                      const embedUrl = getYouTubeEmbedUrl(current.videoUrl);
                      if (embedUrl?.includes("youtube.com/embed")) {
                        return (
                          <div className="relative">
                            <iframe
                              src={embedUrl}
                              className="w-full aspect-video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                            <button
                              onClick={() => updateQuestion(activeQuestion, { videoUrl: "" })}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }
                      if (embedUrl) {
                        return (
                          <div className="relative">
                            <video src={embedUrl} controls className="w-full aspect-video" />
                            <button
                              onClick={() => updateQuestion(activeQuestion, { videoUrl: "" })}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          URL vidéo non reconnue. Utilisez YouTube ou un lien .mp4/.webm.
                        </div>
                      );
                    })()}

                    {current.imageUrl && !current.videoUrl && (
                      <div className="relative">
                        <img src={current.imageUrl} alt="Question media" className="w-full max-h-60 object-contain" />
                        <button
                          onClick={() => updateQuestion(activeQuestion, { imageUrl: "" })}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Media buttons */}
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-muted-foreground"
                    onClick={() => setShowMediaPanel(showMediaPanel === true ? false : true)}
                  >
                    <Image className="w-4 h-4" /> Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-muted-foreground"
                    onClick={() => setShowMediaPanel(showMediaPanel === true ? false : true)}
                  >
                    <Video className="w-4 h-4" /> Vidéo
                  </Button>
                </div>

                {/* Media URL inputs */}
                <AnimatePresence>
                  {showMediaPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                        <div>
                          <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                            <Image className="w-3 h-3" /> URL de l'image
                          </Label>
                          <Input
                            placeholder="https://exemple.com/image.jpg"
                            value={current.imageUrl}
                            onChange={(e) => updateQuestion(activeQuestion, { imageUrl: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                            <Video className="w-3 h-3" /> URL de la vidéo
                          </Label>
                          <Input
                            placeholder="https://youtube.com/watch?v=... ou fichier .mp4"
                            value={current.videoUrl}
                            onChange={(e) => updateQuestion(activeQuestion, { videoUrl: e.target.value })}
                            className="bg-background"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Supporte YouTube, et les liens directs .mp4 / .webm
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Answers */}
              <div className="grid grid-cols-2 gap-3">
                {current.choices.map((choice, i) => (
                  <div
                    key={i}
                    className={`${answerColors[i]} rounded-xl p-4 relative group`}
                  >
                    <Input
                      className="bg-transparent border-none text-center font-semibold placeholder:text-foreground/50 focus-visible:ring-0"
                      placeholder={`Réponse ${i + 1}`}
                      value={choice.text}
                      onChange={(e) => updateChoice(activeQuestion, i, e.target.value)}
                    />
                    {current.type !== "poll" && (
                      <button
                        onClick={() => setCorrectAnswer(activeQuestion, i)}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          choice.isCorrect
                            ? "border-foreground bg-foreground/20"
                            : "border-foreground/30 hover:border-foreground/60"
                        }`}
                      >
                        {choice.isCorrect && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Settings */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Timer (secondes)</Label>
                  <select
                    className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    value={current.timer}
                    onChange={(e) => updateQuestion(activeQuestion, { timer: Number(e.target.value) })}
                  >
                    <option value={10}>10s</option>
                    <option value={20}>20s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Points</Label>
                  <select
                    className="w-full mt-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm"
                    value={current.points}
                    onChange={(e) => updateQuestion(activeQuestion, { points: Number(e.target.value) })}
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default QuizBuilder;
