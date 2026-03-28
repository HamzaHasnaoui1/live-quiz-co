import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Mail,
  Search,
  UserCheck,
  UserX,
  Shield,
  Filter,
  MoreVertical,
  Send,
  Trash2,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import CSVMemberImport from "./CSVMemberImport";

type MemberRole = "Admin" | "Créateur" | "Participant";
type MemberType = "Arbitre" | "Arbitre Assistant" | "Délégué" | "Observateur";
type MemberStatus = "active" | "inactive" | "pending";

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  type: MemberType;
  promo: string;
  status: MemberStatus;
  invitedAt?: string;
  lastActive?: string;
}

const mockMembers: Member[] = [
  { id: "1", name: "Jean Dupont", email: "jean@acme.com", role: "Admin", type: "Arbitre", promo: "2022", status: "active", lastActive: "Il y a 2h" },
  { id: "2", name: "Marie Martin", email: "marie@acme.com", role: "Créateur", type: "Arbitre Assistant", promo: "2023", status: "active", lastActive: "Il y a 1j" },
  { id: "3", name: "Pierre Durand", email: "pierre@acme.com", role: "Participant", type: "Arbitre", promo: "2021", status: "inactive", lastActive: "Il y a 30j" },
  { id: "4", name: "Sophie Laurent", email: "sophie@acme.com", role: "Participant", type: "Délégué", promo: "2023", status: "active", lastActive: "Il y a 5h" },
  { id: "5", name: "", email: "nouveau@acme.com", role: "Participant", type: "Arbitre Assistant", promo: "2024", status: "pending", invitedAt: "Il y a 3j" },
];

const roles: MemberRole[] = ["Admin", "Créateur", "Participant"];
const types: MemberType[] = ["Arbitre", "Arbitre Assistant", "Délégué", "Observateur"];
const promos = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

const MembersTab = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Participant");
  const [inviteType, setInviteType] = useState<MemberType>("Arbitre");
  const [invitePromo, setInvitePromo] = useState("2024");

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || m.role === filterRole;
    const matchType = filterType === "all" || m.type === filterType;
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchRole && matchType && matchStatus;
  });

  const toggleMemberStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
    const member = members.find((m) => m.id === id);
    toast({
      title: member?.status === "active" ? "Compte désactivé" : "Compte activé",
      description: `${member?.name || member?.email} a été ${member?.status === "active" ? "désactivé" : "activé"}.`,
    });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: Member = {
      id: String(Date.now()),
      name: "",
      email: inviteEmail,
      role: inviteRole,
      type: inviteType,
      promo: invitePromo,
      status: "pending",
      invitedAt: "À l'instant",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteOpen(false);
    setInviteEmail("");
    toast({
      title: "Invitation envoyée",
      description: `Un email d'invitation a été envoyé à ${inviteEmail}.`,
    });
  };

  const resendInvite = (member: Member) => {
    toast({
      title: "Invitation renvoyée",
      description: `L'invitation a été renvoyée à ${member.email}.`,
    });
  };

  const removeMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast({
      title: "Membre supprimé",
      description: `${member?.name || member?.email} a été retiré.`,
    });
  };

  const changeRole = (id: string, role: MemberRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    toast({ title: "Rôle modifié", description: `Le rôle a été mis à jour.` });
  };

  const statusBadge = (status: MemberStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-primary/15 text-primary border-0 gap-1"><UserCheck className="w-3 h-3" /> Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="gap-1"><UserX className="w-3 h-3" /> Désactivé</Badge>;
      case "pending":
        return <Badge variant="outline" className="gap-1 text-amber-500 border-amber-500/30"><Mail className="w-3 h-3" /> En attente</Badge>;
    }
  };

  const activeCount = members.filter((m) => m.status === "active").length;
  const pendingCount = members.filter((m) => m.status === "pending").length;
  const inactiveCount = members.filter((m) => m.status === "inactive").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Membres</h1>
          <p className="text-muted-foreground mt-1">
            {activeCount} actifs · {pendingCount} en attente · {inactiveCount} désactivés
          </p>
        </div>
        <Button className="gap-2" onClick={() => setInviteOpen(true)}>
          <Plus className="w-4 h-4" /> Inviter un membre
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Membres actifs</p>
          </div>
        </div>
        <div className="bg-gradient-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Invitations en attente</p>
          </div>
        </div>
        <div className="bg-gradient-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <UserX className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold">{inactiveCount}</p>
            <p className="text-xs text-muted-foreground">Comptes désactivés</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[140px]">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Désactivé</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members table */}
      <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm text-muted-foreground font-medium">Membre</th>
              <th className="text-left p-4 text-sm text-muted-foreground font-medium">Type</th>
              <th className="text-left p-4 text-sm text-muted-foreground font-medium">Promo</th>
              <th className="text-left p-4 text-sm text-muted-foreground font-medium">Rôle</th>
              <th className="text-left p-4 text-sm text-muted-foreground font-medium">Statut</th>
              <th className="text-left p-4 text-sm text-muted-foreground font-medium">Actif/Inactif</th>
              <th className="text-right p-4 text-sm text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">
                        {member.name || <span className="text-muted-foreground italic">Invitation en cours</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-xs">{member.type}</Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{member.promo}</span>
                  </td>
                  <td className="p-4">
                    <Select
                      value={member.role}
                      onValueChange={(val) => changeRole(member.id, val as MemberRole)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">{statusBadge(member.status)}</td>
                  <td className="p-4">
                    {member.status !== "pending" && (
                      <Switch
                        checked={member.status === "active"}
                        onCheckedChange={() => toggleMemberStatus(member.id)}
                      />
                    )}
                    {member.status === "pending" && (
                      <span className="text-xs text-muted-foreground">{member.invitedAt}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.status === "pending" && (
                          <DropdownMenuItem onClick={() => resendInvite(member)} className="gap-2">
                            <Send className="w-3.5 h-3.5" /> Renvoyer l'invitation
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(member.email)}
                          className="gap-2"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copier l'email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => removeMember(member.id)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Aucun membre trouvé avec ces critères.
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Inviter un membre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="membre@entreprise.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                <Select value={inviteType} onValueChange={(v) => setInviteType(v as MemberType)}>
                  <SelectTrigger>
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
                <label className="text-sm text-muted-foreground mb-1 block">Promotion</label>
                <Select value={invitePromo} onValueChange={setInvitePromo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promos.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Rôle</label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                Un email d'invitation sera envoyé avec un lien unique pour créer son compte.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Annuler</Button>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()} className="gap-2">
              <Send className="w-4 h-4" /> Envoyer l'invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MembersTab;
