import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileQuestion, Plus, Upload, Pencil, Play, Presentation,
  UserCheck, Search, ArrowUpDown, SlidersHorizontal, Grid3X3,
  List, Calendar, TrendingUp, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mockQuizzes = [
  { id: 1, title: "Sécurité informatique", questions: 12, played: 5, avgScore: 78, category: "IT", status: "published", createdAt: "2026-03-15", lastPlayed: "2026-03-28" },
  { id: 2, title: "Onboarding RH", questions: 8, played: 12, avgScore: 85, category: "RH", status: "published", createdAt: "2026-02-20", lastPlayed: "2026-03-30" },
  { id: 3, title: "Culture d'entreprise", questions: 15, played: 3, avgScore: 62, category: "Culture", status: "published", createdAt: "2026-03-01", lastPlayed: "2026-03-20" },
  { id: 4, title: "RGPD & Conformité", questions: 20, played: 0, avgScore: 0, category: "Juridique", status: "draft", createdAt: "2026-03-29", lastPlayed: null },
  { id: 5, title: "Gestion de projet Agile", questions: 10, played: 8, avgScore: 71, category: "Management", status: "published", createdAt: "2026-01-10", lastPlayed: "2026-03-25" },
  { id: 6, title: "Accueil nouveaux arrivants", questions: 6, played: 25, avgScore: 91, category: "RH", status: "published", createdAt: "2026-01-05", lastPlayed: "2026-03-30" },
];

type SortOption = "recent" | "oldest" | "score_high" | "score_low" | "most_played" | "alphabetical";
type ViewMode = "grid" | "list";

interface QuizzesTabProps {
  onOpenCsvImport: () => void;
  onOpenAssignModal: (quizTitle: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const statusConfig = {
  published: { label: "Publié", class: "bg-primary/10 text-primary border-primary/20" },
  draft: { label: "Brouillon", class: "bg-muted text-muted-foreground border-border" },
};

const QuizzesTab = ({ onOpenCsvImport, onOpenAssignModal }: QuizzesTabProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categories = useMemo(() => {
    const cats = [...new Set(mockQuizzes.map((q) => q.category))];
    return cats.sort();
  }, []);

  const filteredQuizzes = useMemo(() => {
    let result = [...mockQuizzes];

    // Search
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (q) => q.title.toLowerCase().includes(s) || q.category.toLowerCase().includes(s)
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((q) => q.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((q) => q.status === filterStatus);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "score_high":
        result.sort((a, b) => b.avgScore - a.avgScore);
        break;
      case "score_low":
        result.sort((a, b) => a.avgScore - b.avgScore);
        break;
      case "most_played":
        result.sort((a, b) => b.played - a.played);
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [search, sortBy, filterCategory, filterStatus]);

  const totalQuizzes = mockQuizzes.length;
  const publishedCount = mockQuizzes.filter((q) => q.status === "published").length;
  const draftCount = mockQuizzes.filter((q) => q.status === "draft").length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Mes Quiz</h1>
          <p className="text-muted-foreground mt-1">
            {totalQuizzes} quiz · {publishedCount} publiés · {draftCount} brouillons
          </p>
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

      {/* Search & Filters Bar */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un quiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[150px]">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[170px]">
            <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="score_high">Meilleur score</SelectItem>
            <SelectItem value="score_low">Score le plus bas</SelectItem>
            <SelectItem value="most_played">Plus joués</SelectItem>
            <SelectItem value="alphabetical">Alphabétique</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Active filters chips */}
      {(filterCategory !== "all" || filterStatus !== "all" || search.trim()) && (
        <motion.div variants={item} className="flex flex-wrap gap-2 mb-4">
          {search.trim() && (
            <Badge variant="secondary" className="gap-1.5 cursor-pointer" onClick={() => setSearch("")}>
              Recherche: "{search}" ✕
            </Badge>
          )}
          {filterCategory !== "all" && (
            <Badge variant="secondary" className="gap-1.5 cursor-pointer" onClick={() => setFilterCategory("all")}>
              {filterCategory} ✕
            </Badge>
          )}
          {filterStatus !== "all" && (
            <Badge variant="secondary" className="gap-1.5 cursor-pointer" onClick={() => setFilterStatus("all")}>
              {filterStatus === "published" ? "Publiés" : "Brouillons"} ✕
            </Badge>
          )}
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={() => { setSearch(""); setFilterCategory("all"); setFilterStatus("all"); }}>
            Tout effacer
          </button>
        </motion.div>
      )}

      {/* Results count */}
      <motion.p variants={item} className="text-sm text-muted-foreground mb-4">
        {filteredQuizzes.length} résultat{filteredQuizzes.length !== 1 ? "s" : ""}
      </motion.p>

      {/* No results */}
      {filteredQuizzes.length === 0 && (
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-12 text-center">
          <FileQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">Aucun quiz trouvé</h3>
          <p className="text-sm text-muted-foreground mb-4">Essayez de modifier vos filtres ou créez un nouveau quiz.</p>
          <Button className="gap-2" onClick={() => navigate("/quiz/new")}>
            <Plus className="w-4 h-4" /> Nouveau Quiz
          </Button>
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredQuizzes.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => {
            const status = statusConfig[quiz.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={quiz.id}
                variants={item}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold truncate">{quiz.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-[10px] ${status.class}`}>
                        {status.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {quiz.category}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => navigate("/quiz/new")}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-border">
                  <div className="text-center">
                    <p className="text-lg font-bold font-display">{quiz.questions}</p>
                    <p className="text-[10px] text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold font-display">{quiz.played}</p>
                    <p className="text-[10px] text-muted-foreground">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold font-display ${quiz.avgScore >= 80 ? "text-primary" : quiz.avgScore >= 60 ? "text-[hsl(var(--game-yellow))]" : "text-destructive"}`}>
                      {quiz.avgScore > 0 ? `${quiz.avgScore}%` : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Score moy.</p>
                  </div>
                </div>

                {/* Score progress */}
                {quiz.avgScore > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Progress value={quiz.avgScore} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{quiz.avgScore}%</span>
                  </div>
                )}

                {/* Dates */}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Créé {formatDate(quiz.createdAt)}
                  </span>
                  {quiz.lastPlayed && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Joué {formatDate(quiz.lastPlayed)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5 flex-1" onClick={() => navigate("/quiz/new")}>
                    <Pencil className="w-3 h-3" /> Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 flex-1" onClick={() => onOpenAssignModal(quiz.title)}>
                    <UserCheck className="w-3 h-3" /> Affecter
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="gap-1.5 flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground" onClick={() => navigate("/host")}>
                    <Presentation className="w-3 h-3" /> Animer
                  </Button>
                  <Button size="sm" className="gap-1.5 flex-1" onClick={() => navigate("/play")} disabled={quiz.status === "draft"}>
                    <Play className="w-3 h-3" /> Lancer
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredQuizzes.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {filteredQuizzes.map((quiz, i) => {
            const status = statusConfig[quiz.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={quiz.id}
                variants={item}
                className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${
                  i < filteredQuizzes.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold truncate">{quiz.title}</h3>
                    <Badge variant="outline" className={`text-[10px] flex-shrink-0 ${status.class}`}>
                      {status.label}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">
                      {quiz.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{quiz.questions} questions</span>
                    <span>{quiz.played} sessions</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(quiz.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3 w-32">
                  <Progress value={quiz.avgScore} className="h-1.5 flex-1" />
                  <span className={`text-sm font-semibold min-w-[3ch] ${quiz.avgScore >= 80 ? "text-primary" : quiz.avgScore >= 60 ? "text-[hsl(var(--game-yellow))]" : quiz.avgScore > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {quiz.avgScore > 0 ? `${quiz.avgScore}%` : "—"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate("/quiz/new")}>
                    <Pencil className="w-3 h-3" /> Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => onOpenAssignModal(quiz.title)}>
                    <UserCheck className="w-3 h-3" /> Affecter
                  </Button>
                  <Button size="sm" className="gap-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground" onClick={() => navigate("/host")}>
                    <Presentation className="w-3 h-3" /> Animer
                  </Button>
                  <Button size="sm" className="gap-1" onClick={() => navigate("/play")} disabled={quiz.status === "draft"}>
                    <Play className="w-3 h-3" /> Lancer
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default QuizzesTab;
