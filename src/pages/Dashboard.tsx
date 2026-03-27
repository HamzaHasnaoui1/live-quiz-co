import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap, LayoutDashboard, FileQuestion, Users, BarChart3,
  Settings, Plus, Play, Clock, TrendingUp, LogOut, Monitor,
  Pencil, Presentation, UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuizAssignmentModal, { type AssignmentCriteria } from "@/components/quiz/QuizAssignmentModal";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", id: "dashboard" },
  { icon: FileQuestion, label: "Mes Quiz", id: "quizzes" },
  { icon: Users, label: "Membres", id: "members" },
  { icon: BarChart3, label: "Statistiques", id: "stats" },
  { icon: Settings, label: "Paramètres", id: "settings" },
];

const mockQuizzes = [
  { id: 1, title: "Sécurité informatique", questions: 12, played: 5, avgScore: 78 },
  { id: 2, title: "Onboarding RH", questions: 8, played: 12, avgScore: 85 },
  { id: 3, title: "Culture d'entreprise", questions: 15, played: 3, avgScore: 62 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignModal, setAssignModal] = useState<{ open: boolean; quizTitle: string }>({ open: false, quizTitle: "" });

  const handleAssign = (criteria: AssignmentCriteria) => {
    console.log("Quiz assigned with criteria:", criteria);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-sidebar-foreground">QuizArena</span>
        </div>

        <div className="p-3">
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent mb-4">
            <p className="text-xs text-muted-foreground">Entreprise</p>
            <p className="font-medium text-sm text-sidebar-accent-foreground">Acme Corp</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
                <p className="text-muted-foreground">Bienvenue, Jean 👋</p>
              </div>
              <Button className="gap-2" onClick={() => navigate("/quiz/new")}>
                <Plus className="w-4 h-4" /> Nouveau Quiz
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileQuestion className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Quiz créés</span>
                </div>
                <p className="font-display text-3xl font-bold">3</p>
              </div>
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Play className="w-5 h-5 text-[hsl(var(--game-blue))]" />
                  <span className="text-sm text-muted-foreground">Sessions jouées</span>
                </div>
                <p className="font-display text-3xl font-bold">20</p>
              </div>
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Score moyen</span>
                </div>
                <p className="font-display text-3xl font-bold">75%</p>
              </div>
            </div>

            <h2 className="font-display text-xl font-semibold mb-4">Vos quiz récents</h2>
            <div className="space-y-3">
              {mockQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-gradient-card rounded-xl border border-border p-5 flex items-center justify-between hover:border-primary/30 transition-colors"
                >
                  <div>
                    <h3 className="font-display font-semibold">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.questions} questions · {quiz.played} sessions · Score moy. {quiz.avgScore}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate("/quiz/new")}>
                      <Pencil className="w-3 h-3" /> Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAssignModal({ open: true, quizTitle: quiz.title })}>
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
        )}

        {activeTab === "quizzes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl font-bold">Mes Quiz</h1>
              <Button className="gap-2" onClick={() => navigate("/quiz/new")}>
                <Plus className="w-4 h-4" /> Nouveau Quiz
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-gradient-card rounded-xl border border-border p-6 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-lg font-semibold">{quiz.title}</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigate("/quiz/new")}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{quiz.questions} questions</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {quiz.played} sessions · Score moy. {quiz.avgScore}%
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 flex-1"
                      onClick={() => navigate("/quiz/new")}
                    >
                      <Pencil className="w-3 h-3" /> Modifier
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="gap-1.5 flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      onClick={() => navigate("/host")}
                    >
                      <Presentation className="w-3 h-3" /> Animer
                    </Button>
                    <Button size="sm" className="gap-1.5 flex-1" onClick={() => navigate("/play")}>
                      <Play className="w-3 h-3" /> Lancer
                    </Button>
                  </div>

                  {/* Tooltip explanation */}
                  <div className="mt-3 pt-3 border-t border-border space-y-1">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <Presentation className="w-2.5 h-2.5 text-secondary" />
                      <span><strong>Animer</strong> — Projeter sur grand écran, contrôler le déroulement</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <Play className="w-2.5 h-2.5 text-primary" />
                      <span><strong>Lancer</strong> — Démarrer une session, les joueurs rejoignent via PIN</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "members" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-3xl font-bold">Membres</h1>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Inviter
              </Button>
            </div>
            <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm text-muted-foreground font-medium">Nom</th>
                    <th className="text-left p-4 text-sm text-muted-foreground font-medium">Email</th>
                    <th className="text-left p-4 text-sm text-muted-foreground font-medium">Rôle</th>
                    <th className="text-left p-4 text-sm text-muted-foreground font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Jean Dupont", email: "jean@acme.com", role: "Admin", active: true },
                    { name: "Marie Martin", email: "marie@acme.com", role: "Créateur", active: true },
                    { name: "Pierre Durand", email: "pierre@acme.com", role: "Participant", active: false },
                  ].map((member, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium">{member.name}</td>
                      <td className="p-4 text-muted-foreground">{member.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {member.active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-bold mb-8">Statistiques</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold mb-4">Taux de bonnes réponses</h3>
                <div className="flex items-end gap-2 h-40">
                  {[65, 78, 45, 85, 72, 90, 68].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${val}%` }} />
                      <span className="text-xs text-muted-foreground">Q{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold mb-4">Participation par session</h3>
                <div className="flex items-end gap-2 h-40">
                  {[12, 15, 8, 20, 18, 25, 22].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-[hsl(var(--game-blue))]/80" style={{ height: `${(val / 25) * 100}%` }} />
                      <span className="text-xs text-muted-foreground">S{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-bold mb-8">Paramètres</h1>
            <div className="bg-gradient-card rounded-xl border border-border p-6 max-w-lg space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nom de l'entreprise</label>
                <Input defaultValue="Acme Corp" className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email de contact</label>
                <Input defaultValue="admin@acme.com" className="mt-1" />
              </div>
              <Button>Sauvegarder</Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
