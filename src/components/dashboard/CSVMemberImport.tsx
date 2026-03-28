import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, FileText, AlertCircle, CheckCircle2, Download, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type MemberRole = "Admin" | "Créateur" | "Participant";
type MemberType = "Arbitre" | "Arbitre Assistant" | "Délégué" | "Observateur";

interface ParsedMember {
  email: string;
  name: string;
  role: MemberRole;
  type: MemberType;
  promo: string;
  valid: boolean;
  errors: string[];
}

interface CSVMemberImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (members: ParsedMember[]) => void;
}

const validRoles: MemberRole[] = ["Admin", "Créateur", "Participant"];
const validTypes: MemberType[] = ["Arbitre", "Arbitre Assistant", "Délégué", "Observateur"];

const parseCSV = (text: string): ParsedMember[] => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(/[;,\t]/);
  const emailIdx = header.findIndex((h) => h.trim().includes("email"));
  const nameIdx = header.findIndex((h) => h.trim().includes("nom") || h.trim().includes("name"));
  const roleIdx = header.findIndex((h) => h.trim().includes("rôle") || h.trim().includes("role"));
  const typeIdx = header.findIndex((h) => h.trim().includes("type"));
  const promoIdx = header.findIndex((h) => h.trim().includes("promo"));

  return lines.slice(1).filter(l => l.trim()).map((line) => {
    const sep = line.includes(";") ? ";" : line.includes("\t") ? "\t" : ",";
    const cols = line.split(sep).map((c) => c.trim());
    const errors: string[] = [];

    const email = emailIdx >= 0 ? cols[emailIdx] || "" : "";
    const name = nameIdx >= 0 ? cols[nameIdx] || "" : "";
    const role = roleIdx >= 0 ? cols[roleIdx] || "" : "Participant";
    const type = typeIdx >= 0 ? cols[typeIdx] || "" : "Arbitre";
    const promo = promoIdx >= 0 ? cols[promoIdx] || "" : "2024";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email invalide");
    if (!validRoles.includes(role as MemberRole)) errors.push(`Rôle inconnu: ${role}`);
    if (!validTypes.includes(type as MemberType)) errors.push(`Type inconnu: ${type}`);

    return {
      email,
      name,
      role: validRoles.includes(role as MemberRole) ? (role as MemberRole) : "Participant",
      type: validTypes.includes(type as MemberType) ? (type as MemberType) : "Arbitre",
      promo: promo || "2024",
      valid: errors.length === 0,
      errors,
    };
  });
};

const CSVMemberImport = ({ open, onOpenChange, onImport }: CSVMemberImportProps) => {
  const [parsed, setParsed] = useState<ParsedMember[]>([]);
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setParsed([]);
    setFileName("");
    setStep("upload");
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const members = parseCSV(text);
      setParsed(members);
      setFileName(file.name);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    const valid = parsed.filter((m) => m.valid);
    onImport(valid);
    toast({
      title: `${valid.length} membre(s) importé(s)`,
      description: `Les invitations seront envoyées par email.`,
    });
    reset();
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const csv = "email;nom;type;promo;rôle\nexemple@email.com;Jean Dupont;Arbitre;2024;Participant\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele_membres.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsed.filter((m) => m.valid).length;
  const errorCount = parsed.filter((m) => !m.valid).length;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Importer des membres (CSV)</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4 py-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Glissez un fichier CSV ici</p>
              <p className="text-xs text-muted-foreground mt-1">ou cliquez pour parcourir</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            <Button variant="outline" size="sm" className="gap-2 w-full" onClick={downloadTemplate}>
              <Download className="w-3.5 h-3.5" /> Télécharger le modèle CSV
            </Button>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Colonnes attendues :</p>
              <p className="text-xs text-muted-foreground">
                <code className="bg-muted px-1 rounded">email</code> · <code className="bg-muted px-1 rounded">nom</code> · <code className="bg-muted px-1 rounded">type</code> · <code className="bg-muted px-1 rounded">promo</code> · <code className="bg-muted px-1 rounded">rôle</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Séparateurs : virgule, point-virgule ou tabulation</p>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{fileName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                <X className="w-3.5 h-3.5 mr-1" /> Changer
              </Button>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm">{validCount} valide(s)</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-sm text-destructive">{errorCount} erreur(s)</span>
                </div>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Nom</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Promo</th>
                    <th className="p-2 text-left">Rôle</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {parsed.map((m, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-b border-border last:border-0 ${!m.valid ? "bg-destructive/5" : ""}`}
                      >
                        <td className="p-2">{m.email}</td>
                        <td className="p-2">{m.name || "—"}</td>
                        <td className="p-2"><Badge variant="outline" className="text-[10px]">{m.type}</Badge></td>
                        <td className="p-2">{m.promo}</td>
                        <td className="p-2">{m.role}</td>
                        <td className="p-2">
                          {m.valid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <span className="text-destructive" title={m.errors.join(", ")}>
                              <AlertCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {errorCount > 0 && (
              <p className="text-xs text-muted-foreground">
                Les lignes en erreur seront ignorées lors de l'import.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Annuler</Button>
          {step === "preview" && (
            <Button onClick={handleImport} disabled={validCount === 0} className="gap-2">
              <Upload className="w-4 h-4" /> Importer {validCount} membre(s)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVMemberImport;
