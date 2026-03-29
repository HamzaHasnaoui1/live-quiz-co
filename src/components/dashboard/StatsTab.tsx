import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, Target, Clock, Award,
  ArrowUpRight, ArrowDownRight, Calendar
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const mockKPIs = [
  { label: "Taux de réussite", value: "75%", change: "+5%", positive: true, icon: Target },
  { label: "Score moyen", value: "68/100", change: "+3pts", positive: true, icon: TrendingUp },
  { label: "Participants actifs", value: "142", change: "-8", positive: false, icon: Users },
  { label: "Temps moyen / quiz", value: "4m32s", change: "-12s", positive: true, icon: Clock },
];

const correctRateData = [65, 78, 45, 85, 72, 90, 68, 55, 82, 74];
const participationData = [12, 15, 8, 20, 18, 25, 22, 30, 16, 28];

const topQuizzes = [
  { title: "Sécurité informatique", sessions: 25, avgScore: 78, completion: 92 },
  { title: "Onboarding RH", sessions: 18, avgScore: 85, completion: 88 },
  { title: "Culture d'entreprise", sessions: 12, avgScore: 62, completion: 75 },
  { title: "RGPD & Conformité", sessions: 10, avgScore: 71, completion: 80 },
];

const difficultyQuestions = [
  { question: "Qu'est-ce qu'un ransomware ?", quiz: "Sécurité informatique", errorRate: 68 },
  { question: "Délai de réponse RGPD ?", quiz: "RGPD & Conformité", errorRate: 55 },
  { question: "Valeurs fondatrices ?", quiz: "Culture d'entreprise", errorRate: 48 },
  { question: "Processus d'escalade ?", quiz: "Onboarding RH", errorRate: 42 },
];

const StatsTab = () => {
  const [period, setPeriod] = useState("30j");
  const [selectedQuiz, setSelectedQuiz] = useState("all");

  const maxParticipation = Math.max(...participationData);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Statistiques</h1>
          <p className="text-muted-foreground">Analysez les performances de votre équipe</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7j">7 derniers jours</SelectItem>
              <SelectItem value="30j">30 derniers jours</SelectItem>
              <SelectItem value="90j">3 mois</SelectItem>
              <SelectItem value="365j">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les quiz</SelectItem>
              <SelectItem value="securite">Sécurité informatique</SelectItem>
              <SelectItem value="onboarding">Onboarding RH</SelectItem>
              <SelectItem value="culture">Culture d'entreprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockKPIs.map((kpi) => (
          <Card key={kpi.label} className="bg-gradient-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 px-2 py-1 rounded-full ${
                  kpi.positive
                    ? "text-primary bg-primary/10"
                    : "text-destructive bg-destructive/10"
                }`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="font-display text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="quizzes">Par quiz</TabsTrigger>
          <TabsTrigger value="difficulty">Questions difficiles</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Taux de bonnes réponses</CardTitle>
                <p className="text-xs text-muted-foreground">Par question (dernières sessions)</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1.5 h-44">
                  {correctRateData.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}%
                      </span>
                      <motion.div
                        className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-colors cursor-default"
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      />
                      <span className="text-[10px] text-muted-foreground">Q{i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Participation par session</CardTitle>
                <p className="text-xs text-muted-foreground">Nombre de joueurs par session</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1.5 h-44">
                  {participationData.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                      <motion.div
                        className="w-full rounded-t-md bg-secondary/80 hover:bg-secondary transition-colors cursor-default"
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / maxParticipation) * 100}%` }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      />
                      <span className="text-[10px] text-muted-foreground">S{i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score distribution */}
            <Card className="bg-gradient-card border-border md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Distribution des scores</CardTitle>
                <p className="text-xs text-muted-foreground">Répartition des scores sur l'ensemble des sessions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: "90-100%", count: 18, pct: 12 },
                    { range: "70-89%", count: 52, pct: 35 },
                    { range: "50-69%", count: 45, pct: 30 },
                    { range: "30-49%", count: 25, pct: 17 },
                    { range: "0-29%", count: 8, pct: 6 },
                  ].map((bucket) => (
                    <div key={bucket.range} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-20 text-right">{bucket.range}</span>
                      <div className="flex-1">
                        <Progress value={bucket.pct} className="h-6" />
                      </div>
                      <span className="text-sm text-muted-foreground w-20">
                        {bucket.count} joueurs ({bucket.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Per quiz tab */}
        <TabsContent value="quizzes">
          <div className="space-y-4">
            {topQuizzes.map((quiz, i) => (
              <Card key={quiz.title} className="bg-gradient-card border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{quiz.sessions} sessions jouées</p>
                    </div>
                    <div className="flex gap-8 text-center">
                      <div>
                        <p className="font-display text-xl font-bold">{quiz.avgScore}%</p>
                        <p className="text-[10px] text-muted-foreground">Score moyen</p>
                      </div>
                      <div>
                        <p className="font-display text-xl font-bold">{quiz.completion}%</p>
                        <p className="text-[10px] text-muted-foreground">Complétion</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={quiz.avgScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Difficulty tab */}
        <TabsContent value="difficulty">
          <div className="space-y-3">
            {difficultyQuestions.map((q) => (
              <Card key={q.question} className="bg-gradient-card border-border">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{q.question}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.quiz}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-destructive">{q.errorRate}%</p>
                      <p className="text-[10px] text-muted-foreground">taux d'erreur</p>
                    </div>
                    <div className="w-24">
                      <Progress value={q.errorRate} className="h-2 [&>div]:bg-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default StatsTab;
