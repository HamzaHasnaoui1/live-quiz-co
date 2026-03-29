import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Shield, Save, Mail, Phone, Camera, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", isDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
};

const PlayerSettingsTab = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "fr");
  const [notifications, setNotifications] = useState({
    results: true,
    assigned: true,
    reminders: true,
    leaderboard: false,
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const handleSave = (section: string) => {
    toast.success(`${section} sauvegardé avec succès`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold mb-1">Paramètres</h2>
        <p className="text-muted-foreground text-sm">Gérez votre profil et vos préférences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" /> Sécurité
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Globe className="w-4 h-4" /> Apparence
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Mon profil</CardTitle>
              <CardDescription>Vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-display font-bold text-primary">
                    MM
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-display font-semibold text-lg">Marie Martin</p>
                  <p className="text-sm text-muted-foreground">Participant · Acme Corp</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Promo 2024 · Arbitre</p>
                </div>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input defaultValue="Marie" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input defaultValue="Martin" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label>
                  <Input defaultValue="marie.martin@acme.com" disabled className="opacity-60" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Téléphone</Label>
                  <Input defaultValue="+33 6 98 76 54 32" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={() => handleSave("Profil")}>
                  <Save className="w-4 h-4" /> Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Notifications</CardTitle>
              <CardDescription>Choisissez les alertes que vous souhaitez recevoir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "results" as const, label: "Résultats de quiz", desc: "Recevoir un récapitulatif après chaque quiz" },
                { key: "assigned" as const, label: "Nouveau quiz affecté", desc: "Quand un quiz vous est assigné" },
                { key: "reminders" as const, label: "Rappels de deadline", desc: "Rappel avant la date limite d'un quiz" },
                { key: "leaderboard" as const, label: "Mise à jour classement", desc: "Changement de position au classement" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button className="gap-2" onClick={() => handleSave("Notifications")}>
                  <Save className="w-4 h-4" /> Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Changer le mot de passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Mot de passe actuel</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le nouveau mot de passe</Label>
                <Input type="password" />
              </div>
              <Button className="gap-2" onClick={() => handleSave("Mot de passe")}>
                <Shield className="w-4 h-4" /> Mettre à jour
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Apparence & Langue</CardTitle>
              <CardDescription>Personnalisez votre expérience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">🌙 Sombre</SelectItem>
                    <SelectItem value="light">☀️ Clair</SelectItem>
                    <SelectItem value="system">💻 Système</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Le thème est appliqué immédiatement</p>
              </div>
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={() => handleSave("Apparence")}>
                  <Save className="w-4 h-4" /> Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PlayerSettingsTab;
