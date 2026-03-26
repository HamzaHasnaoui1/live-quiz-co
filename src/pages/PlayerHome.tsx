import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap, Gamepad2, Trophy, Clock, Star, LogOut,
  History, ArrowRight, Medal, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mockHistory = [
  { id: 1, title: "Sécurité informatique", date: "2026-03-25", score: 850, rank: 2, total: 12, correct: 10 },
  { id: 2, title: "Onboarding RH", date: "2026-03-22", score: 1200, rank: 1, total: 8, correct: 8 },
  { id: 3, title: "Culture d'entreprise", date: "2026-03-18", score: 620, rank: 5, total: 15, correct: 9 },
  { id: 4, title: "Cybersécurité avancée", date: "2026-03-10", score: 400, rank: 8, total: 10, correct: 5 },
];

const PlayerHome = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) navigate("/join");
  };

  const totalGames = mockHistory.length;
  const avgScore = Math.round(mockHistory.reduce((s, h) => s + h.score, 0) / totalGames);
  const bestRank = Math.min(...mockHistory.map((h) => h.rank));
  const accuracy = Math.round(
    (mockHistory.reduce((s, h) => s + h.correct, 0) /
      mockHistory.reduce((s, h) => s + h.total, 0)) *
      100
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">QuizArena</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Marie Martin</p>
              <p className="text-xs text-muted-foreground">Acme Corp</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Join Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border p-6 sm:p-8"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-[0.07]" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                Rejoindre un Quiz 🎮
              </h1>
              <p className="text-muted-foreground text-sm">
                Entrez le code PIN affiché par l'animateur pour rejoindre la session.
              </p>
            </div>
            <form onSubmit={handleJoin} className="flex gap-2 w-full sm:w-auto">
              <Input
                className="text-center text-xl sm:text-2xl font-display tracking-[0.3em] py-5 bg-muted/60 border-border w-full sm:w-52"
                placeholder="000000"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              <Button
                type="submit"
                size="lg"
                className="gap-2 px-6 shadow-glow-primary shrink-0"
                disabled={pin.length !== 6}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { icon: Gamepad2, label: "Parties jouées", value: totalGames, color: "text-[hsl(var(--game-blue))]" },
            { icon: Star, label: "Score moyen", value: avgScore, color: "text-[hsl(var(--game-yellow))]" },
            { icon: Medal, label: "Meilleur rang", value: `#${bestRank}`, color: "text-[hsl(var(--game-orange))]" },
            { icon: TrendingUp, label: "Précision", value: `${accuracy}%`, color: "text-primary" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-4"
              style={{ background: "var(--gradient-card)" }}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.section>

        {/* History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-xl font-semibold">Historique des quiz</h2>
          </div>
          <div className="space-y-3">
            {mockHistory.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="rounded-xl border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between hover:border-primary/30 transition-colors"
                style={{ background: "var(--gradient-card)" }}
              >
                <div className="flex-1">
                  <h3 className="font-display font-semibold">{game.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(game.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>{game.correct}/{game.total} bonnes réponses</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-display font-bold text-lg">{game.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-display font-bold text-sm ${
                      game.rank === 1
                        ? "bg-[hsl(var(--game-yellow))]/20 text-[hsl(var(--game-yellow))]"
                        : game.rank <= 3
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    #{game.rank}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {mockHistory.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-display text-lg">Aucun quiz joué pour le moment</p>
              <p className="text-sm">Entrez un code PIN ci-dessus pour commencer !</p>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default PlayerHome;
