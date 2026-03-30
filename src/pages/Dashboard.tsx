import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap, LayoutDashboard, FileQuestion, Users, BarChart3,
  Settings, LogOut, Trophy, Plus, Upload, Pencil, Play,
  Presentation, UserCheck, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QuizAssignmentModal, { type AssignmentCriteria } from "@/components/quiz/QuizAssignmentModal";
import LeaderboardTab from "@/components/dashboard/LeaderboardTab";
import MembersTab from "@/components/dashboard/MembersTab";
import CSVQuizImport from "@/components/dashboard/CSVQuizImport";
import StatsTab from "@/components/dashboard/StatsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import DashboardTab from "@/components/dashboard/DashboardTab";
import QuizzesTab from "@/components/dashboard/QuizzesTab";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", id: "dashboard" },
  { icon: FileQuestion, label: "Mes Quiz", id: "quizzes" },
  { icon: Trophy, label: "Classement", id: "leaderboard" },
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
  const [csvQuizImportOpen, setCsvQuizImportOpen] = useState(false);

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
          <DashboardTab
            onOpenCsvImport={() => setCsvQuizImportOpen(true)}
            onOpenAssignModal={(title) => setAssignModal({ open: true, quizTitle: title })}
          />
        )}

        {activeTab === "quizzes" && (
          <QuizzesTab
            onOpenCsvImport={() => setCsvQuizImportOpen(true)}
            onOpenAssignModal={(title) => setAssignModal({ open: true, quizTitle: title })}
          />
        )}

        {activeTab === "leaderboard" && <LeaderboardTab />}
        {activeTab === "members" && <MembersTab />}
        {activeTab === "stats" && <StatsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>

      <QuizAssignmentModal
        open={assignModal.open}
        onOpenChange={(open) => setAssignModal({ ...assignModal, open })}
        quizTitle={assignModal.quizTitle}
        onAssign={handleAssign}
      />

      <CSVQuizImport
        open={csvQuizImportOpen}
        onOpenChange={setCsvQuizImportOpen}
        onImport={(quizzes) => {
          console.log("Imported quizzes:", Object.fromEntries(quizzes));
        }}
      />
    </div>
  );
};

export default Dashboard;
