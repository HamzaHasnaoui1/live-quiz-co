import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap, Gamepad2, Trophy, Clock, Star, LogOut,
  History, ArrowRight, Medal, TrendingUp, ChevronLeft,
  CheckCircle2, XCircle, Eye, FileQuestion, Play, UserCheck,
  BarChart3, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PlayerStatsTab from "@/components/player/PlayerStatsTab";
import PlayerSettingsTab from "@/components/player/PlayerSettingsTab";

interface QuizQuestion {
  question: string;
  type: "mcq" | "truefalse";
  options: string[];
  correctIndex: number;
  playerAnswer: number;
  timeSpent: number;
  timeLimit: number;
  points: number;
  earnedPoints: number;
}

interface GameHistory {
  id: number;
  title: string;
  date: string;
  score: number;
  rank: number;
  total: number;
  correct: number;
  questions: QuizQuestion[];
}

const mockHistory: GameHistory[] = [
  {
    id: 1, title: "Sécurité informatique", date: "2026-03-25", score: 850, rank: 2, total: 12, correct: 10,
    questions: [
      { question: "Quel est le protocole sécurisé pour naviguer sur le web ?", type: "mcq", options: ["HTTP", "HTTPS", "FTP", "SMTP"], correctIndex: 1, playerAnswer: 1, timeSpent: 8, timeLimit: 20, points: 100, earnedPoints: 100 },
      { question: "Un mot de passe fort doit contenir au moins 8 caractères.", type: "truefalse", options: ["Vrai", "Faux"], correctIndex: 0, playerAnswer: 0, timeSpent: 4, timeLimit: 10, points: 50, earnedPoints: 50 },
      { question: "Quel type d'attaque consiste à envoyer des emails frauduleux ?", type: "mcq", options: ["DDoS", "Phishing", "Brute force", "SQL Injection"], correctIndex: 1, playerAnswer: 1, timeSpent: 12, timeLimit: 20, points: 100, earnedPoints: 80 },
      { question: "Qu'est-ce qu'un pare-feu (firewall) ?", type: "mcq", options: ["Un antivirus", "Un filtre réseau", "Un VPN", "Un proxy"], correctIndex: 1, playerAnswer: 2, timeSpent: 18, timeLimit: 20, points: 100, earnedPoints: 0 },
      { question: "Le chiffrement AES est symétrique.", type: "truefalse", options: ["Vrai", "Faux"], correctIndex: 0, playerAnswer: 0, timeSpent: 3, timeLimit: 10, points: 50, earnedPoints: 50 },
    ],
  },
  {
    id: 2, title: "Onboarding RH", date: "2026-03-22", score: 1200, rank: 1, total: 8, correct: 8,
    questions: [
      { question: "Combien de jours dure la période d'essai pour un CDI cadre ?", type: "mcq", options: ["2 mois", "3 mois", "4 mois", "6 mois"], correctIndex: 2, playerAnswer: 2, timeSpent: 10, timeLimit: 20, points: 100, earnedPoints: 100 },
      { question: "Le CSE est obligatoire dans les entreprises de plus de 11 salariés.", type: "truefalse", options: ["Vrai", "Faux"], correctIndex: 0, playerAnswer: 0, timeSpent: 5, timeLimit: 10, points: 50, earnedPoints: 50 },
      { question: "Quel document est remis obligatoirement à l'embauche ?", type: "mcq", options: ["Fiche de paie", "Contrat de travail", "Attestation Pôle Emploi", "Certificat de travail"], correctIndex: 1, playerAnswer: 1, timeSpent: 7, timeLimit: 20, points: 100, earnedPoints: 100 },
    ],
  },
  {
    id: 3, title: "Culture d'entreprise", date: "2026-03-18", score: 620, rank: 5, total: 15, correct: 9,
    questions: [
      { question: "En quelle année a été fondée Acme Corp ?", type: "mcq", options: ["2005", "2010", "2015", "2020"], correctIndex: 1, playerAnswer: 2, timeSpent: 15, timeLimit: 20, points: 100, earnedPoints: 0 },
      { question: "Acme Corp compte plus de 500 employés.", type: "truefalse", options: ["Vrai", "Faux"], correctIndex: 1, playerAnswer: 1, timeSpent: 6, timeLimit: 10, points: 50, earnedPoints: 50 },
    ],
  },
  {
    id: 4, title: "Cybersécurité avancée", date: "2026-03-10", score: 400, rank: 8, total: 10, correct: 5,
    questions: [
      { question: "Qu'est-ce qu'une attaque zero-day ?", type: "mcq", options: ["Attaque le jour 0", "Exploit d'une faille inconnue", "Reset du système", "Suppression de données"], correctIndex: 1, playerAnswer: 0, timeSpent: 20, timeLimit: 20, points: 100, earnedPoints: 0 },
      { question: "RSA est un algorithme de chiffrement asymétrique.", type: "truefalse", options: ["Vrai", "Faux"], correctIndex: 0, playerAnswer: 1, timeSpent: 8, timeLimit: 10, points: 50, earnedPoints: 0 },
    ],
  },
];

const PlayerHome = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [selectedGame, setSelectedGame] = useState<GameHistory | null>(null);
  const [activeTab, setActiveTab] = useState("home");

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

  // Detail view
  if (selectedGame) {
    const correctCount = selectedGame.questions.filter((q) => q.playerAnswer === q.correctIndex).length;
    const totalQ = selectedGame.questions.length;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedGame(null)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-display font-bold text-sm sm:text-base truncate">{selectedGame.title}</h1>
              <p className="text-xs text-muted-foreground">
                {new Date(selectedGame.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-display font-bold">{selectedGame.score} pts</p>
                <p className="text-xs text-muted-foreground">Rang #{selectedGame.rank}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Summary bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-1 rounded-xl border border-border p-4 text-center" style={{ background: "var(--gradient-card)" }}>
              <p className="font-display text-2xl font-bold text-primary">{correctCount}</p>
              <p className="text-xs text-muted-foreground">Correctes</p>
            </div>
            <div className="flex-1 rounded-xl border border-border p-4 text-center" style={{ background: "var(--gradient-card)" }}>
              <p className="font-display text-2xl font-bold text-[hsl(var(--game-red))]">{totalQ - correctCount}</p>
              <p className="text-xs text-muted-foreground">Incorrectes</p>
            </div>
            <div className="flex-1 rounded-xl border border-border p-4 text-center" style={{ background: "var(--gradient-card)" }}>
              <p className="font-display text-2xl font-bold">{Math.round((correctCount / totalQ) * 100)}%</p>
              <p className="text-xs text-muted-foreground">Précision</p>
            </div>
          </motion.div>

          {/* Questions */}
          <div className="space-y-4">
            {selectedGame.questions.map((q, i) => {
              const isCorrect = q.playerAnswer === q.correctIndex;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border overflow-hidden"
                  style={{ background: "var(--gradient-card)" }}
                >
                  {/* Question header */}
                  <div className="p-4 sm:p-5 flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-xs font-bold ${
                        isCorrect
                          ? "bg-primary/15 text-primary"
                          : "bg-[hsl(var(--game-red))]/15 text-[hsl(var(--game-red))]"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm sm:text-base">{q.question}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {q.timeSpent}s / {q.timeLimit}s
                        </span>
                        <span>
                          {q.earnedPoints}/{q.points} pts
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] uppercase tracking-wider">
                          {q.type === "mcq" ? "QCM" : "Vrai/Faux"}
                        </span>
                      </div>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[hsl(var(--game-red))] shrink-0" />
                    )}
                  </div>

                  {/* Options */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 grid gap-2" style={{ gridTemplateColumns: q.type === "truefalse" ? "1fr 1fr" : "1fr 1fr" }}>
                    {q.options.map((opt, oi) => {
                      const isPlayerChoice = oi === q.playerAnswer;
                      const isCorrectOption = oi === q.correctIndex;
                      let classes = "rounded-lg px-3 py-2.5 text-sm border transition-colors ";

                      if (isCorrectOption) {
                        classes += "border-primary/40 bg-primary/10 text-primary";
                      } else if (isPlayerChoice && !isCorrect) {
                        classes += "border-[hsl(var(--game-red))]/40 bg-[hsl(var(--game-red))]/10 text-[hsl(var(--game-red))]";
                      } else {
                        classes += "border-border bg-muted/30 text-muted-foreground";
                      }

                      return (
                        <div key={oi} className={classes}>
                          <div className="flex items-center gap-2">
                            {isCorrectOption && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                            {isPlayerChoice && !isCorrect && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                            <span>{opt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // Main view
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">QuizArena</span>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { id: "home", label: "Accueil", icon: Gamepad2 },
              { id: "stats", label: "Statistiques", icon: BarChart3 },
              { id: "settings", label: "Paramètres", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
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
        {activeTab === "stats" && <PlayerStatsTab />}
        {activeTab === "settings" && <PlayerSettingsTab />}
        {activeTab === "home" && <div className="space-y-8">
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

        {/* Assigned Quizzes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Quiz qui vous sont affectés</h2>
          </div>
          <div className="space-y-3">
            {[
              { id: 101, title: "Règles d'arbitrage 2026", questions: 15, deadline: "2026-04-05", assignedBy: "Jean Dupont", criteria: "Arbitre · Promo 2024" },
              { id: 102, title: "Protocole VAR", questions: 10, deadline: "2026-04-10", assignedBy: "Jean Dupont", criteria: "Arbitre Assistant" },
              { id: 103, title: "Évaluation annuelle", questions: 20, deadline: "2026-03-30", assignedBy: "Marie Martin", criteria: "Tous les rôles" },
            ].map((quiz, i) => {
              const isUrgent = new Date(quiz.deadline) <= new Date(Date.now() + 3 * 86400000);
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between transition-colors ${
                    isUrgent ? "border-[hsl(var(--game-orange))]/40 bg-[hsl(var(--game-orange))]/5" : "border-border"
                  }`}
                  style={!isUrgent ? { background: "var(--gradient-card)" } : undefined}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="w-4 h-4 text-primary" />
                      <h3 className="font-display font-semibold">{quiz.title}</h3>
                      {isUrgent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[hsl(var(--game-orange))]/20 text-[hsl(var(--game-orange))]">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span>{quiz.questions} questions</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Avant le {new Date(quiz.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-xs">Affecté par {quiz.assignedBy}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 italic">Critères : {quiz.criteria}</p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 shadow-glow-primary shrink-0"
                    onClick={() => navigate("/join")}
                  >
                    <Play className="w-3 h-3" /> Commencer
                  </Button>
                </motion.div>
              );
            })}
          </div>
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
                className="rounded-xl border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between hover:border-primary/30 transition-colors cursor-pointer"
                style={{ background: "var(--gradient-card)" }}
                onClick={() => setSelectedGame(game)}
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={(e) => { e.stopPropagation(); setSelectedGame(game); }}
                  >
                    <Eye className="w-3 h-3" /> Détails
                  </Button>
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
