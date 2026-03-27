import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AssignmentCriteria {
  types: string[];
  promos: string[];
  roles: string[];
}

interface QuizAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizTitle: string;
  onAssign: (criteria: AssignmentCriteria) => void;
}

const USER_TYPES = ["Arbitre", "Arbitre Assistant", "Joueur", "Formateur", "Observateur"];
const PROMOS = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const ROLES = ["SUPER_ADMIN", "COMPANY_ADMIN", "CREATOR", "PARTICIPANT"];

const mockUserCounts: Record<string, number> = {
  "Arbitre": 12,
  "Arbitre Assistant": 8,
  "Joueur": 45,
  "Formateur": 5,
  "Observateur": 3,
  "2019": 6,
  "2020": 14,
  "2021": 18,
  "2022": 22,
  "2023": 15,
  "2024": 10,
  "2025": 8,
  "2026": 4,
  "SUPER_ADMIN": 2,
  "COMPANY_ADMIN": 4,
  "CREATOR": 8,
  "PARTICIPANT": 55,
};

const QuizAssignmentModal = ({
  open,
  onOpenChange,
  quizTitle,
  onAssign,
}: QuizAssignmentModalProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [assigned, setAssigned] = useState(false);

  const toggle = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const totalSelected = selectedTypes.length + selectedPromos.length + selectedRoles.length;

  const estimatedUsers = () => {
    const all = [...selectedTypes, ...selectedPromos, ...selectedRoles];
    if (all.length === 0) return 0;
    // Mock: sum unique counts with overlap reduction
    const sum = all.reduce((s, k) => s + (mockUserCounts[k] || 0), 0);
    return Math.min(sum, 73); // cap at total mock users
  };

  const handleAssign = () => {
    onAssign({ types: selectedTypes, promos: selectedPromos, roles: selectedRoles });
    setAssigned(true);
    setTimeout(() => {
      setAssigned(false);
      onOpenChange(false);
      setSelectedTypes([]);
      setSelectedPromos([]);
      setSelectedRoles([]);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Affecter le quiz
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-foreground">{quizTitle}</span>
            {" — "}Sélectionnez les critères pour cibler les utilisateurs.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {assigned ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center gap-3"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <p className="font-display font-bold text-lg">Quiz affecté !</p>
              <p className="text-sm text-muted-foreground">
                ~{estimatedUsers()} utilisateurs ciblés
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5 py-2"
            >
              {/* Type filter */}
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Filter className="w-3 h-3" /> Type d'utilisateur
                </Label>
                <div className="flex flex-wrap gap-2">
                  {USER_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggle(selectedTypes, type, setSelectedTypes)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        selectedTypes.includes(type)
                          ? "border-primary bg-primary/15 text-primary font-medium"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {type}
                      <span className="ml-1.5 text-xs opacity-60">({mockUserCounts[type]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo filter */}
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Filter className="w-3 h-3" /> Promotion (année)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {PROMOS.map((promo) => (
                    <button
                      key={promo}
                      onClick={() => toggle(selectedPromos, promo, setSelectedPromos)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        selectedPromos.includes(promo)
                          ? "border-primary bg-primary/15 text-primary font-medium"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {promo}
                      <span className="ml-1.5 text-xs opacity-60">({mockUserCounts[promo]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role filter */}
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Filter className="w-3 h-3" /> Rôle
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => toggle(selectedRoles, role, setSelectedRoles)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                        selectedRoles.includes(role)
                          ? "border-primary bg-primary/15 text-primary font-medium"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {role.replace("_", " ")}
                      <span className="ml-1.5 text-xs opacity-60">({mockUserCounts[role]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selection summary */}
              {totalSelected > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-primary/20 bg-primary/5 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Critères sélectionnés</p>
                    <button
                      onClick={() => {
                        setSelectedTypes([]);
                        setSelectedPromos([]);
                        setSelectedRoles([]);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Tout effacer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTypes.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                        <button onClick={() => toggle(selectedTypes, t, setSelectedTypes)} className="ml-1">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </Badge>
                    ))}
                    {selectedPromos.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        Promo {p}
                        <button onClick={() => toggle(selectedPromos, p, setSelectedPromos)} className="ml-1">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </Badge>
                    ))}
                    {selectedRoles.map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {r.replace("_", " ")}
                        <button onClick={() => toggle(selectedRoles, r, setSelectedRoles)} className="ml-1">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ~<span className="font-semibold text-foreground">{estimatedUsers()}</span> utilisateurs ciblés
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!assigned && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAssign}
              disabled={totalSelected === 0}
              className="gap-2 shadow-glow-primary"
            >
              <Users className="w-4 h-4" />
              Affecter ({estimatedUsers()} users)
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizAssignmentModal;
