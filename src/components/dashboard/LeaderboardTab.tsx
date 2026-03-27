import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Filter, TrendingUp, Crown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardEntry {
  id: number;
  name: string;
  type: string;
  promo: string;
  role: string;
  totalScore: number;
  gamesPlayed: number;
  avgScore: number;
  accuracy: number;
  bestRank: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: "Marie Martin", type: "Arbitre", promo: "2022", role: "Arbitre Central", totalScore: 12850, gamesPlayed: 18, avgScore: 714, accuracy: 92, bestRank: 1 },
  { id: 2, name: "Jean Dupont", type: "Arbitre", promo: "2021", role: "Arbitre Central", totalScore: 11200, gamesPlayed: 15, avgScore: 747, accuracy: 88, bestRank: 1 },
  { id: 3, name: "Pierre Durand", type: "Arbitre Assistant", promo: "2022", role: "Arbitre Assistant 1", totalScore: 10500, gamesPlayed: 20, avgScore: 525, accuracy: 85, bestRank: 2 },
  { id: 4, name: "Sophie Laurent", type: "Arbitre", promo: "2023", role: "Arbitre Central", totalScore: 9800, gamesPlayed: 12, avgScore: 817, accuracy: 90, bestRank: 1 },
  { id: 5, name: "Lucas Bernard", type: "Arbitre Assistant", promo: "2021", role: "Arbitre Assistant 2", totalScore: 8900, gamesPlayed: 16, avgScore: 556, accuracy: 78, bestRank: 3 },
  { id: 6, name: "Emma Petit", type: "Arbitre", promo: "2023", role: "Arbitre Central", totalScore: 8400, gamesPlayed: 10, avgScore: 840, accuracy: 94, bestRank: 1 },
  { id: 7, name: "Hugo Moreau", type: "Observateur", promo: "2020", role: "Observateur", totalScore: 7600, gamesPlayed: 14, avgScore: 543, accuracy: 72, bestRank: 4 },
  { id: 8, name: "Léa Roux", type: "Arbitre Assistant", promo: "2022", role: "Arbitre Assistant 1", totalScore: 7200, gamesPlayed: 11, avgScore: 655, accuracy: 82, bestRank: 2 },
  { id: 9, name: "Thomas Girard", type: "Arbitre", promo: "2020", role: "Arbitre Central", totalScore: 6800, gamesPlayed: 9, avgScore: 756, accuracy: 80, bestRank: 2 },
  { id: 10, name: "Chloé Bonnet", type: "Observateur", promo: "2023", role: "Observateur", totalScore: 6100, gamesPlayed: 13, avgScore: 469, accuracy: 70, bestRank: 5 },
  { id: 11, name: "Antoine Leroy", type: "Arbitre", promo: "2024", role: "Arbitre Central", totalScore: 5500, gamesPlayed: 7, avgScore: 786, accuracy: 86, bestRank: 2 },
  { id: 12, name: "Camille Fournier", type: "Arbitre Assistant", promo: "2024", role: "Arbitre Assistant 2", totalScore: 4900, gamesPlayed: 8, avgScore: 613, accuracy: 76, bestRank: 3 },
];

const seasons = ["2025-2026", "2024-2025", "2023-2024", "2022-2023"];
const promos = ["Toutes", "2020", "2021", "2022", "2023", "2024"];
const types = ["Tous", "Arbitre", "Arbitre Assistant", "Observateur"];
const roles = ["Tous", "Arbitre Central", "Arbitre Assistant 1", "Arbitre Assistant 2", "Observateur"];

const LeaderboardTab = () => {
  const [season, setSeason] = useState("2025-2026");
  const [promo, setPromo] = useState("Toutes");
  const [type, setType] = useState("Tous");
  const [role, setRole] = useState("Tous");
  const [sortBy, setSortBy] = useState<"totalScore" | "avgScore" | "accuracy" | "gamesPlayed">("totalScore");

  const filtered = mockLeaderboard
    .filter((u) => promo === "Toutes" || u.promo === promo)
    .filter((u) => type === "Tous" || u.type === type)
    .filter((u) => role === "Tous" || u.role === role)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const topThree = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "from-[hsl(var(--game-yellow))] to-[hsl(var(--game-orange))]";
    if (rank === 2) return "from-[hsl(220,15%,70%)] to-[hsl(220,10%,55%)]";
    if (rank === 3) return "from-[hsl(25,60%,50%)] to-[hsl(25,50%,40%)]";
    return "";
  };

  const sortLabels: Record<string, string> = {
    totalScore: "Score total",
    avgScore: "Score moyen",
    accuracy: "Précision",
    gamesPlayed: "Parties jouées",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Classement Global</h1>
          <p className="text-muted-foreground mt-1">Performance de tous les participants</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{filtered.length} participant{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Saison</label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Promo</label>
          <Select value={promo} onValueChange={setPromo}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {promos.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Rôle</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Trier par</label>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Podium top 3 */}
      {topThree.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-10">
          {[topThree[1], topThree[0], topThree[2]].map((user, idx) => {
            const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
            const height = rank === 1 ? "h-36" : rank === 2 ? "h-28" : "h-20";
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankStyle(rank)} flex items-center justify-center mb-2`}>
                  {rank === 1 ? (
                    <Crown className="w-6 h-6 text-background" />
                  ) : (
                    <span className="font-display font-bold text-background text-lg">{rank}</span>
                  )}
                </div>
                <p className="font-display font-semibold text-sm mb-0.5 text-center">{user.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{user.type} · {user.promo}</p>
                <div
                  className={`w-24 ${height} rounded-t-xl bg-gradient-to-t ${getRankStyle(rank)} flex items-center justify-center`}
                  style={{ opacity: 0.8 }}
                >
                  <div className="text-center">
                    <p className="font-display font-bold text-background text-lg">{user[sortBy].toLocaleString()}</p>
                    <p className="text-[10px] text-background/70">{sortLabels[sortBy]}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full leaderboard table */}
      <div className="rounded-xl border border-border overflow-hidden" style={{ background: "var(--gradient-card)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-xs text-muted-foreground font-medium w-12">#</th>
              <th className="text-left p-4 text-xs text-muted-foreground font-medium">Participant</th>
              <th className="text-left p-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Type</th>
              <th className="text-left p-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Promo</th>
              <th className="text-left p-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Rôle</th>
              <th className="text-right p-4 text-xs text-muted-foreground font-medium">Score total</th>
              <th className="text-right p-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Moy.</th>
              <th className="text-right p-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Précision</th>
              <th className="text-right p-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">Parties</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => {
              const rank = i + 1;
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`border-b border-border last:border-0 transition-colors hover:bg-muted/20 ${
                    rank <= 3 ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <td className="p-4">
                    {rank <= 3 ? (
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getRankStyle(rank)} flex items-center justify-center`}>
                        <span className="font-display font-bold text-background text-xs">{rank}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground font-medium pl-1.5">{rank}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{user.type} · {user.promo}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.type === "Arbitre"
                        ? "bg-primary/15 text-primary"
                        : user.type === "Arbitre Assistant"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{user.promo}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{user.role}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-display font-bold">{user.totalScore.toLocaleString()}</span>
                  </td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <span className="text-sm">{user.avgScore}</span>
                  </td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <span className={`text-sm font-medium ${
                      user.accuracy >= 85 ? "text-primary" : user.accuracy >= 70 ? "text-[hsl(var(--game-yellow))]" : "text-[hsl(var(--game-red))]"
                    }`}>
                      {user.accuracy}%
                    </span>
                  </td>
                  <td className="p-4 text-right hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{user.gamesPlayed}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-display text-lg">Aucun participant trouvé</p>
            <p className="text-sm">Modifiez les filtres pour voir les résultats.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeaderboardTab;
