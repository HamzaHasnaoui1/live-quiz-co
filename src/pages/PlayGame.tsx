import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";

const mockQuestion = {
  text: "Quel langage est utilisé pour styliser les pages web ?",
  choices: ["HTML", "CSS", "Python", "Java"],
  correctIndex: 1,
  timer: 20,
};

const mockLeaderboard = [
  { name: "Alice", score: 2400, avatar: "🦊" },
  { name: "Bob", score: 2100, avatar: "🐻" },
  { name: "Charlie", score: 1800, avatar: "🐸" },
  { name: "Vous", score: 1500, avatar: "⭐" },
  { name: "Diana", score: 1200, avatar: "🦋" },
];

const answerColors = ["game-answer-1", "game-answer-2", "game-answer-3", "game-answer-4"];

const PlayGame = () => {
  const [phase, setPhase] = useState<"question" | "result" | "leaderboard">("question");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(mockQuestion.timer);

  useEffect(() => {
    if (phase !== "question" || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "question") {
      setPhase("result");
      setTimeout(() => setPhase("leaderboard"), 3000);
    }
  }, [timeLeft, phase]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setTimeout(() => setPhase("result"), 1000);
    setTimeout(() => setPhase("leaderboard"), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {phase === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl"
          >
            {/* Timer */}
            <div className="flex justify-center mb-8">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (timeLeft / mockQuestion.timer) * 283}
                    className="transition-all duration-1000 linear"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold">
                  {timeLeft}
                </span>
              </div>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
              {mockQuestion.text}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {mockQuestion.choices.map((choice, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(i)}
                  className={`${answerColors[i]} rounded-xl p-6 text-center font-display font-semibold text-lg transition-all ${
                    selectedAnswer === i ? "ring-4 ring-foreground/50 scale-95" : "hover:scale-[1.02]"
                  } ${selectedAnswer !== null && selectedAnswer !== i ? "opacity-50" : ""}`}
                >
                  {choice}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {selectedAnswer === mockQuestion.correctIndex ? (
              <>
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.3 }}
                >
                  <Star className="w-20 h-20 text-game-yellow mx-auto mb-4" />
                </motion.div>
                <h2 className="font-display text-4xl font-bold text-primary mb-2">Correct ! 🎉</h2>
                <p className="text-xl text-muted-foreground">+100 points</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">😢</span>
                </div>
                <h2 className="font-display text-4xl font-bold text-destructive mb-2">Raté !</h2>
                <p className="text-xl text-muted-foreground">
                  La bonne réponse était : {mockQuestion.choices[mockQuestion.correctIndex]}
                </p>
              </>
            )}
          </motion.div>
        )}

        {phase === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <Trophy className="w-8 h-8 text-game-yellow" />
              <h2 className="font-display text-3xl font-bold">Classement</h2>
            </div>
            <div className="space-y-2">
              {mockLeaderboard.map((player, i) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    player.name === "Vous"
                      ? "bg-primary/10 border-primary/30"
                      : "bg-gradient-card border-border"
                  }`}
                >
                  <span className="font-display text-xl font-bold w-8 text-center">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </span>
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="flex-1 font-medium">{player.name}</span>
                  <span className="font-display font-bold text-primary">{player.score}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayGame;
