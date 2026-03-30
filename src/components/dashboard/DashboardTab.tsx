import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileQuestion, Users, Play, Clock, TrendingUp, Plus, Upload,
  Pencil, Presentation, UserCheck, Trophy, ArrowUpRight, ArrowDownRight,
  Calendar, Target, Flame, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { type AssignmentCriteria } from "@/components/quiz/QuizAssignmentModal";

const mockQuizzes = [
  { id: 1, title: "Sécurité informatique", questions: 12, played: 5, avgScore: 78, trend: +3 },
  { id: 2, title: "Onboarding RH", questions: 8, played: 12, avgScore: 85, trend: +7 },
  { id: 3, title: "Culture d'entreprise", questions: 15, played: 3, avgScore: 62, trend: -2 },
];

const recentActivity = [
  { type: "quiz_completed", user: "Marie D.", quiz: "Sécurité informatique", score: 92, time: "il y a 12 min" },
  { type: "quiz_started", user: "Pierre L.", quiz: "Onboarding RH", score: null, time: "il y a 25 min" },
  { type: "member_joined", user: "Sophie M.", quiz: null, score: null, time: "il y a 1h" },
  { type: "quiz_completed", user: "Luc B.", quiz: "Culture d'entreprise", score: 68, time: "il y a 2h" },
  { type: "quiz_completed", user: "Emma R.", quiz: "Sécurité informatique", score: 85, time: "il y a 3h" },
];

interface DashboardTabProps {
  onOpenCsvImport: () => void;
  onOpenAssignModal: (quizTitle: string) => void;
}

const statCards = [
  {
    icon: FileQuestion,
    label: "Quiz créés",
    value: "3",
    change: "+1 ce mois",
    up: true,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Play,
    label: "Sessions jouées",
    value: "20",
    change: "+8 cette semaine",
    up: true,
    color: "text-[hsl(var(--game-blue))]",
    bgColor: "bg-[hsl(var(--game-blue))]/10",
  },
  {
    icon: Users,
    label: "Participants actifs",
    value: "47",
    change: "+12 ce mois",
    up: true,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Target,
    label: "Score moyen",
    value: "75%",
    change: "+3% vs semaine dern.",
    up: true,
    color: "text-[hsl(var(--game-yellow))]",
    bgColor: "bg-[hsl(var(--game-yellow))]/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const DashboardTab = ({ onOpenCsvImport, onOpenAssignModal }: DashboardTabProps) => {
  const navigate = useNavigate();

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue, Jean 👋</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={onOpenCsvImport}>
            <Upload className="w-4 h-4" /> Importer CSV
          </Button>
          <Button className="gap-2" onClick={() => navigate("/quiz/new")}>
            <Plus className="w-4 h-4" /> Nouveau Quiz
          </Button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-primary" : "text-destructive"}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="font-display text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz récents — 2 colonnes */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Quiz récents</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1" onClick={() => {}}>
              Voir tout <ArrowUpRight className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-semibold text-lg">{quiz.title}</h3>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        quiz.trend >= 0
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}>
                        {quiz.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {quiz.trend >= 0 ? "+" : ""}{quiz.trend}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><FileQuestion className="w-3.5 h-3.5" /> {quiz.questions} questions</span>
                      <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5" /> {quiz.played} sessions</span>
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="flex items-center gap-3 mb-4">
                  <Progress value={quiz.avgScore} className="h-2 flex-1" />
                  <span className="text-sm font-semibold text-primary min-w-[3ch]">{quiz.avgScore}%</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate("/quiz/new")}>
                    <Pencil className="w-3 h-3" /> Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onOpenAssignModal(quiz.title)}>
                    <UserCheck className="w-3 h-3" /> Affecter
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate("/host")}>
                    <Clock className="w-3 h-3" /> Historique
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    onClick={() => navigate("/host")}
                  >
                    <Presentation className="w-3 h-3" /> Animer
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={() => navigate("/play")}>
                    <Play className="w-3 h-3" /> Lancer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activité récente — 1 colonne */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Activité récente</h2>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-1">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  act.type === "quiz_completed" ? "bg-primary/10" :
                  act.type === "quiz_started" ? "bg-[hsl(var(--game-blue))]/10" :
                  "bg-secondary/10"
                }`}>
                  {act.type === "quiz_completed" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  {act.type === "quiz_started" && <Play className="w-4 h-4 text-[hsl(var(--game-blue))]" />}
                  {act.type === "member_joined" && <Users className="w-4 h-4 text-secondary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{act.user}</span>
                    {act.type === "quiz_completed" && <> a terminé <span className="text-primary font-medium">{act.quiz}</span></>}
                    {act.type === "quiz_started" && <> a commencé <span className="text-[hsl(var(--game-blue))] font-medium">{act.quiz}</span></>}
                    {act.type === "member_joined" && <> a rejoint l'équipe</>}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{act.time}</span>
                    {act.score !== null && (
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                        act.score >= 80 ? "bg-primary/10 text-primary" : "bg-[hsl(var(--game-yellow))]/10 text-[hsl(var(--game-yellow))]"
                      }`}>
                        {act.score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Streak / engagement card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--game-orange))]/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-[hsl(var(--game-orange))]" />
              </div>
              <div>
                <p className="font-display font-semibold">Engagement</p>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => {
                const active = i < 5;
                return (
                  <div key={i} className="text-center">
                    <div className={`w-full aspect-square rounded-md ${
                      active ? "bg-primary/20 border border-primary/40" : "bg-muted/50 border border-border"
                    } flex items-center justify-center`}>
                      {active && <CheckCircle2 className="w-3 h-3 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{day}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <span className="text-primary font-semibold">5 jours</span> d'activité consécutifs 🔥
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardTab;
