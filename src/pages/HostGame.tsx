import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Clock, ChevronRight, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const mockQuiz = {
  title: "Culture Générale - Développement Web",
  pin: "482 917",
  questions: [
    {
      text: "Quel langage est utilisé pour styliser les pages web ?",
      choices: ["HTML", "CSS", "Python", "Java"],
      correctIndex: 1,
      timer: 20,
      points: 100,
      type: "multiple" as const,
    },
    {
      text: "JavaScript est un langage compilé.",
      choices: ["Vrai", "Faux"],
      correctIndex: 1,
      timer: 15,
      points: 100,
      type: "truefalse" as const,
    },
    {
      text: "Quelle balise HTML est utilisée pour les liens ?",
      choices: ["<link>", "<a>", "<href>", "<url>"],
      correctIndex: 1,
      timer: 20,
      points: 100,
      type: "multiple" as const,
    },
  ],
};

const mockParticipants = [
  { name: "Alice", avatar: "🦊", score: 0 },
  { name: "Bob", avatar: "🐻", score: 0 },
  { name: "Charlie", avatar: "🐸", score: 0 },
  { name: "Diana", avatar: "🦋", score: 0 },
  { name: "Eve", avatar: "🐱", score: 0 },
  { name: "Frank", avatar: "🐶", score: 0 },
  { name: "Grace", avatar: "🦄", score: 0 },
  { name: "Hector", avatar: "🐼", score: 0 },
];

const answerGradients = [
  "bg-gradient-to-br from-[hsl(var(--game-red))] to-[hsl(var(--game-orange))]",
  "bg-gradient-to-br from-[hsl(var(--game-blue))] to-[hsl(var(--game-purple))]",
  "bg-gradient-to-br from-[hsl(var(--game-green))] to-[hsl(170,70%,45%)]",
  "bg-gradient-to-br from-[hsl(var(--game-yellow))] to-[hsl(var(--game-orange))]",
];

const answerShapes = ["▲", "◆", "●", "■"];

type Phase = "lobby" | "question" | "responses" | "reveal" | "leaderboard" | "final";

const HostGame = () => {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answersReceived, setAnswersReceived] = useState(0);
  const [answerDistribution, setAnswerDistribution] = useState<number[]>([]);
  const [scores, setScores] = useState(() => mockParticipants.map((p) => ({ ...p })));
  const totalParticipants = mockParticipants.length;
  const question = mockQuiz.questions[currentQ];

  // Timer countdown
  useEffect(() => {
    if (phase !== "question" || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  // Simulate incoming answers
  useEffect(() => {
    if (phase !== "question") return;
    const intervals: NodeJS.Timeout[] = [];
    mockParticipants.forEach((_, i) => {
      const delay = 2000 + Math.random() * (question.timer * 800);
      intervals.push(
        setTimeout(() => {
          setAnswersReceived((prev) => Math.min(prev + 1, totalParticipants));
        }, delay)
      );
    });
    return () => intervals.forEach(clearTimeout);
  }, [phase, currentQ]);

  // Auto-transition when timer ends
  useEffect(() => {
    if (timeLeft === 0 && phase === "question") {
      setPhase("reveal");
    }
  }, [timeLeft, phase]);

  // Generate answer distribution on reveal
  useEffect(() => {
    if (phase === "reveal") {
      const dist = question.choices.map((_, i) =>
        i === question.correctIndex
          ? Math.floor(totalParticipants * 0.5 + Math.random() * totalParticipants * 0.3)
          : Math.floor(Math.random() * totalParticipants * 0.25)
      );
      // Normalize to total
      const sum = dist.reduce((a, b) => a + b, 0);
      setAnswerDistribution(dist.map((d) => Math.round((d / sum) * totalParticipants)));
    }
  }, [phase]);

  const startQuestion = useCallback(() => {
    setTimeLeft(question.timer);
    setAnswersReceived(0);
    setAnswerDistribution([]);
    setPhase("question");
  }, [question]);

  const showLeaderboard = () => {
    // Simulate score updates
    setScores((prev) =>
      prev
        .map((p) => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 150 + 50),
        }))
        .sort((a, b) => b.score - a.score)
    );
    setPhase("leaderboard");
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= mockQuiz.questions.length) {
      setPhase("final");
    } else {
      setCurrentQ((q) => q + 1);
      startQuestion();
    }
  };

  const timerPercent = question ? (timeLeft / question.timer) * 100 : 0;
  const timerColor =
    timerPercent > 50 ? "hsl(var(--game-green))" : timerPercent > 20 ? "hsl(var(--game-yellow))" : "hsl(var(--game-red))";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">{mockQuiz.title}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground tracking-widest">
            PIN: {mockQuiz.pin}
          </span>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-foreground">{totalParticipants}</span>
          </div>
          {phase !== "lobby" && phase !== "final" && (
            <span>
              Question {currentQ + 1}/{mockQuiz.questions.length}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* ─── LOBBY ─── */}
          {phase === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-xl w-full"
            >
              <h1 className="font-display text-6xl font-bold mb-4 text-gradient-hero">
                QuizArena
              </h1>
              <p className="text-muted-foreground text-xl mb-8">
                Partagez le code PIN pour rejoindre
              </p>
              <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">Code PIN</p>
                <p className="font-display text-7xl font-bold tracking-[0.3em] text-primary">
                  {mockQuiz.pin}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
                <Users className="w-5 h-5" />
                <span className="text-lg">
                  <strong className="text-foreground">{totalParticipants}</strong> joueurs connectés
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {mockParticipants.map((p) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-muted rounded-full px-4 py-2 flex items-center gap-2"
                  >
                    <span className="text-lg">{p.avatar}</span>
                    <span className="font-medium text-sm">{p.name}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                size="lg"
                className="px-12 py-6 text-lg shadow-glow-primary"
                onClick={startQuestion}
              >
                Lancer le quiz <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* ─── QUESTION ─── */}
          {phase === "question" && (
            <motion.div
              key={`question-${currentQ}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="w-full max-w-5xl"
            >
              {/* Timer bar */}
              <div className="mb-6">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: timerColor }}
                    initial={{ width: "100%" }}
                    animate={{ width: `${timerPercent}%` }}
                    transition={{ duration: 0.8, ease: "linear" }}
                  />
                </div>
              </div>

              <div className="flex items-start justify-between mb-8">
                {/* Timer circle */}
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={timerColor}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (timeLeft / question.timer) * 264}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold">
                    {timeLeft}
                  </span>
                </div>

                {/* Question text */}
                <h2 className="font-display text-3xl md:text-5xl font-bold text-center flex-1 px-8">
                  {question.text}
                </h2>

                {/* Answers counter */}
                <div className="bg-card border border-border rounded-2xl p-5 text-center shrink-0 min-w-[120px]">
                  <BarChart3 className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-display text-3xl font-bold text-primary">{answersReceived}</p>
                  <p className="text-xs text-muted-foreground">/ {totalParticipants} réponses</p>
                </div>
              </div>

              {/* Answer choices */}
              <div className={`grid gap-4 ${question.choices.length <= 2 ? "grid-cols-2" : "grid-cols-2"}`}>
                {question.choices.map((choice, i) => (
                  <div
                    key={i}
                    className={`${answerGradients[i]} rounded-2xl p-6 md:p-8 flex items-center gap-4`}
                  >
                    <span className="text-3xl opacity-60">{answerShapes[i]}</span>
                    <span className="font-display font-semibold text-xl md:text-2xl text-white">
                      {choice}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── REVEAL ─── */}
          {phase === "reveal" && (
            <motion.div
              key={`reveal-${currentQ}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-5xl"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
                {question.text}
              </h2>

              <div className={`grid gap-4 ${question.choices.length <= 2 ? "grid-cols-2" : "grid-cols-2"} mb-10`}>
                {question.choices.map((choice, i) => {
                  const isCorrect = i === question.correctIndex;
                  const count = answerDistribution[i] || 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{
                        opacity: isCorrect ? 1 : 0.4,
                        scale: isCorrect ? 1.02 : 0.95,
                      }}
                      className={`${answerGradients[i]} rounded-2xl p-6 md:p-8 flex items-center gap-4 relative overflow-hidden ${
                        isCorrect ? "ring-4 ring-white/40" : ""
                      }`}
                    >
                      <span className="text-3xl opacity-60">{answerShapes[i]}</span>
                      <span className="font-display font-semibold text-xl md:text-2xl text-white flex-1">
                        {choice}
                      </span>
                      <span className="font-display text-2xl font-bold text-white/90">{count}</span>
                      {isCorrect && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-3xl"
                        >
                          ✅
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="px-10 py-5 text-lg shadow-glow-primary"
                  onClick={showLeaderboard}
                >
                  <Trophy className="w-5 h-5 mr-2" /> Voir le classement
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── LEADERBOARD ─── */}
          {phase === "leaderboard" && (
            <motion.div
              key={`leaderboard-${currentQ}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-10">
                <Trophy className="w-10 h-10 text-[hsl(var(--game-yellow))]" />
                <h2 className="font-display text-4xl font-bold">Classement</h2>
              </div>

              <div className="space-y-3">
                {scores.slice(0, 5).map((player, i) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex items-center gap-4 bg-card border border-border rounded-xl p-5"
                  >
                    <span className="font-display text-2xl font-bold w-10 text-center">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                    </span>
                    <span className="text-2xl">{player.avatar}</span>
                    <span className="flex-1 font-display font-semibold text-lg">{player.name}</span>
                    <span className="font-display text-xl font-bold text-primary">{player.score}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-10">
                <Button
                  size="lg"
                  className="px-10 py-5 text-lg shadow-glow-primary"
                  onClick={nextQuestion}
                >
                  {currentQ + 1 < mockQuiz.questions.length ? (
                    <>
                      Question suivante <ChevronRight className="w-5 h-5 ml-1" />
                    </>
                  ) : (
                    "Résultats finaux 🏆"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── FINAL ─── */}
          {phase === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl w-full"
            >
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
                className="text-7xl mb-6"
              >
                🏆
              </motion.div>
              <h1 className="font-display text-5xl font-bold mb-2">Quiz terminé !</h1>
              <p className="text-muted-foreground text-xl mb-10">Bravo à tous les participants</p>

              {/* Podium */}
              <div className="flex items-end justify-center gap-4 mb-10">
                {[1, 0, 2].map((rank) => {
                  const player = scores[rank];
                  if (!player) return null;
                  const heights = ["h-40", "h-32", "h-24"];
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <motion.div
                      key={rank}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rank * 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-3xl mb-2">{player.avatar}</span>
                      <span className="font-display font-bold text-lg mb-1">{player.name}</span>
                      <span className="text-primary font-display font-bold mb-2">{player.score}</span>
                      <div
                        className={`${heights[rank]} w-28 rounded-t-xl flex items-start justify-center pt-3 ${
                          rank === 0
                            ? "bg-gradient-to-b from-[hsl(var(--game-yellow))] to-[hsl(var(--game-orange))]"
                            : rank === 1
                            ? "bg-gradient-to-b from-muted to-muted/50"
                            : "bg-gradient-to-b from-[hsl(var(--game-orange)/0.6)] to-[hsl(var(--game-orange)/0.3)]"
                        }`}
                      >
                        <span className="text-3xl">{medals[rank]}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-5"
                onClick={() => window.location.href = "/dashboard"}
              >
                Retour au dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HostGame;
