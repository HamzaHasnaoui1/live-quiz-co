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

type QuestionType = "multiple" | "truefalse" | "poll";

interface ParsedQuestion {
  quizTitle: string;
  questionText: string;
  type: QuestionType;
  choices: string[];
  correctAnswer: string;
  timer: number;
  points: number;
  valid: boolean;
  errors: string[];
}

interface CSVQuizImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (quizzes: Map<string, ParsedQuestion[]>) => void;
}

const parseQuizCSV = (text: string): ParsedQuestion[] => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(/[;,\t]/);
  const findCol = (keywords: string[]) => header.findIndex((h) => keywords.some((k) => h.trim().includes(k)));

  const quizIdx = findCol(["quiz", "titre quiz"]);
  const questionIdx = findCol(["question"]);
  const typeIdx = findCol(["type"]);
  const c1Idx = findCol(["choix1", "choix 1", "réponse1", "reponse1", "a"]);
  const c2Idx = findCol(["choix2", "choix 2", "réponse2", "reponse2", "b"]);
  const c3Idx = findCol(["choix3", "choix 3", "réponse3", "reponse3", "c"]);
  const c4Idx = findCol(["choix4", "choix 4", "réponse4", "reponse4", "d"]);
  const correctIdx = findCol(["correct", "bonne réponse", "bonne reponse", "réponse correcte"]);
  const timerIdx = findCol(["timer", "temps", "durée"]);
  const pointsIdx = findCol(["points", "score"]);

  return lines.slice(1).filter((l) => l.trim()).map((line) => {
    const sep = line.includes(";") ? ";" : line.includes("\t") ? "\t" : ",";
    const cols = line.split(sep).map((c) => c.trim());
    const errors: string[] = [];

    const quizTitle = quizIdx >= 0 ? cols[quizIdx] || "Quiz importé" : "Quiz importé";
    const questionText = questionIdx >= 0 ? cols[questionIdx] || "" : "";
    const rawType = typeIdx >= 0 ? cols[typeIdx]?.toLowerCase() || "multiple" : "multiple";
    const choices = [c1Idx, c2Idx, c3Idx, c4Idx]
      .filter((i) => i >= 0)
      .map((i) => cols[i] || "")
      .filter(Boolean);
    const correctAnswer = correctIdx >= 0 ? cols[correctIdx] || "" : "";
    const timer = timerIdx >= 0 ? parseInt(cols[timerIdx]) || 20 : 20;
    const points = pointsIdx >= 0 ? parseInt(cols[pointsIdx]) || 100 : 100;

    let type: QuestionType = "multiple";
    if (rawType.includes("vrai") || rawType.includes("true")) type = "truefalse";
    else if (rawType.includes("sondage") || rawType.includes("poll")) type = "poll";

    if (!questionText) errors.push("Question vide");
    if (choices.length < 2) errors.push("Moins de 2 choix");
    if (type !== "poll" && !correctAnswer) errors.push("Pas de bonne réponse");

    return {
      quizTitle,
      questionText,
      type,
      choices,
      correctAnswer,
      timer,
      points,
      valid: errors.length === 0,
      errors,
    };
  });
};

const CSVQuizImport = ({ open, onOpenChange, onImport }: CSVQuizImportProps) => {
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
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
      const questions = parseQuizCSV(text);
      setParsed(questions);
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
    const valid = parsed.filter((q) => q.valid);
    const grouped = new Map<string, ParsedQuestion[]>();
    valid.forEach((q) => {
      const list = grouped.get(q.quizTitle) || [];
      list.push(q);
      grouped.set(q.quizTitle, list);
    });
    onImport(grouped);
    toast({
      title: `${valid.length} question(s) importée(s)`,
      description: `${grouped.size} quiz créé(s) à partir du CSV.`,
    });
    reset();
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const csv = "quiz;question;type;choix1;choix2;choix3;choix4;correct;timer;points\nSécurité;Quel protocole est sécurisé ?;multiple;HTTP;HTTPS;FTP;SMTP;HTTPS;20;100\nSécurité;Le HTTPS chiffre les données;vrai/faux;Vrai;Faux;;;Vrai;15;50\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele_quiz.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsed.filter((q) => q.valid).length;
  const errorCount = parsed.filter((q) => !q.valid).length;
  const quizTitles = [...new Set(parsed.filter((q) => q.valid).map((q) => q.quizTitle))];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Importer des quiz (CSV)</DialogTitle>
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
                <code className="bg-muted px-1 rounded">quiz</code> · <code className="bg-muted px-1 rounded">question</code> · <code className="bg-muted px-1 rounded">type</code> · <code className="bg-muted px-1 rounded">choix1</code> <code className="bg-muted px-1 rounded">choix2</code> <code className="bg-muted px-1 rounded">choix3</code> <code className="bg-muted px-1 rounded">choix4</code> · <code className="bg-muted px-1 rounded">correct</code> · <code className="bg-muted px-1 rounded">timer</code> · <code className="bg-muted px-1 rounded">points</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Types : <code className="bg-muted px-1 rounded">multiple</code>, <code className="bg-muted px-1 rounded">vrai/faux</code>, <code className="bg-muted px-1 rounded">sondage</code></p>
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

            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm">{validCount} question(s) valide(s)</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-sm text-destructive">{errorCount} erreur(s)</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">{quizTitles.length} quiz détecté(s)</span>
              </div>
            </div>

            {quizTitles.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {quizTitles.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            )}

            <div className="max-h-60 overflow-y-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="p-2 text-left">Quiz</th>
                    <th className="p-2 text-left">Question</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Choix</th>
                    <th className="p-2 text-left">Correct</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {parsed.map((q, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-b border-border last:border-0 ${!q.valid ? "bg-destructive/5" : ""}`}
                      >
                        <td className="p-2 max-w-[100px] truncate">{q.quizTitle}</td>
                        <td className="p-2 max-w-[150px] truncate">{q.questionText}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-[10px]">
                            {q.type === "multiple" ? "QCM" : q.type === "truefalse" ? "V/F" : "Sondage"}
                          </Badge>
                        </td>
                        <td className="p-2">{q.choices.length} choix</td>
                        <td className="p-2 max-w-[80px] truncate">{q.correctAnswer || "—"}</td>
                        <td className="p-2">
                          {q.valid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <span className="text-destructive" title={q.errors.join(", ")}>
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
              <Upload className="w-4 h-4" /> Importer {validCount} question(s)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CSVQuizImport;
