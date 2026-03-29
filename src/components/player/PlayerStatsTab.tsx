import { motion } from "framer-motion";
import {
  Target, TrendingUp, Clock, Award, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const playerKPIs = [
  { label: "Score total", value: "3 070", change: "+450", positive: true, icon: Award },
  { label: "Précision globale", value: "82%", change: "+4%", positive: true, icon: Target },
  { label: "Temps moyen / question", value: "9.2s", change: "-1.3s", positive: true, icon: Clock },
  { label: "Quiz complétés", value: "4", change: "+1", positive: true, icon: BarChart3 },
];

const quizPerformances = [
  { title: "Onboarding RH", score: 1200, maxScore: 1200, accuracy: 100, rank: 1 },
  { title: "Sécurité informatique", score: 850, maxScore: 1200, accuracy: 83, rank: 2 },
  { title: "Culture d'entreprise", score: 620, maxScore: 1000, accuracy: 60, rank: 5 },
  { title: "Cybersécurité avancée", score: 400, maxScore: 1000, accuracy: 50, rank: 8 },
];

const strengths = [
  { category: "Ressources Humaines", accuracy: 95 },
  { category: "Sécurité de base", accuracy: 88 },
  { category: "Culture générale", accuracy: 72 },
  { category: "Cybersécurité avancée", accuracy: 50 },
];

const recentAnswers = [
  { question: "Durée période d'essai CDI cadre ?", correct: true, time: "10s", quiz: "Onboarding RH" },
  { question: "Qu'est-ce qu'un pare-feu ?", correct: false, time: "18s", quiz: "Sécurité informatique" },
  { question: "Année de fondation Acme Corp ?", correct: false, time: "15s", quiz: "Culture d'entreprise" },
  { question: "Protocole sécurisé web ?", correct: true, time: "8s", quiz: "Sécurité informatique" },
  { question: "CSE obligatoire > 11 salariés ?", correct: true, time: "5s", quiz: "Onboarding RH" },
  { question: "Qu'est-ce qu'une attaque zero-day ?", correct: false, time: "20s", quiz: "Cybersécurité avancée" },
];

const PlayerStatsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-display text-2xl font-bold mb-1">Mes statistiques</h2>
        <p className="text-muted-foreground text-sm">Suivez votre progression et identifiez vos points d'amélioration</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {playerKPIs.map((kpi) => (
          <Card key={kpi.label} className="bg-gradient-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-4 h-4 text-primary" />
                </div>
                <span className={`text-[10px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                  kpi.positive ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"
                }`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="font-display text-xl font-bold">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance par quiz */}
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Performance par quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizPerformances.map((q) => (
              <div key={q.title}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium truncate pr-2">{q.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">#{q.rank}</span>
                    <span className="text-sm font-display font-bold">{q.accuracy}%</span>
                  </div>
                </div>
                <Progress value={q.accuracy} className="h-2" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {q.score} / {q.maxScore} pts
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Points forts / faibles */}
        <Card className="bg-gradient-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Points forts & axes d'amélioration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.map((s) => (
              <div key={s.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{s.category}</span>
                  <span className={`text-sm font-display font-bold ${
                    s.accuracy >= 80 ? "text-primary" : s.accuracy >= 60 ? "text-[hsl(var(--game-yellow))]" : "text-[hsl(var(--game-red))]"
                  }`}>
                    {s.accuracy}%
                  </span>
                </div>
                <Progress
                  value={s.accuracy}
                  className={`h-2 ${
                    s.accuracy >= 80 ? "" : s.accuracy >= 60 ? "[&>div]:bg-[hsl(var(--game-yellow))]" : "[&>div]:bg-[hsl(var(--game-red))]"
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Dernières réponses */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Dernières réponses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentAnswers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
              >
                {a.correct ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-[hsl(var(--game-red))] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.question}</p>
                  <p className="text-[10px] text-muted-foreground">{a.quiz}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {a.time}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlayerStatsTab;
