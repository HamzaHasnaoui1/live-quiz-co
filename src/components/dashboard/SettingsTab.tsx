import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, User, Bell, Shield, Palette, Globe, Save, Mail, Phone, MapPin, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SettingsTab = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    quizComplete: true,
    newMember: false,
    weeklyReport: true,
  });

  const handleSave = (section: string) => {
    toast.success(`${section} sauvegardé avec succès`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre compte et de votre organisation</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" /> Entreprise
          </TabsTrigger>
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
            <Palette className="w-4 h-4" /> Apparence
          </TabsTrigger>
        </TabsList>

        {/* Company */}
        <TabsContent value="company">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Informations de l'entreprise</CardTitle>
              <CardDescription>Détails de votre organisation visibles par les membres</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Logo de l'entreprise</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 2 Mo</p>
                </div>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'entreprise</Label>
                  <Input defaultValue="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label>Secteur d'activité</Label>
                  <Select defaultValue="tech">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technologie</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="sante">Santé</SelectItem>
                      <SelectItem value="education">Éducation</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email de contact</Label>
                  <Input defaultValue="admin@acme.com" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Téléphone</Label>
                  <Input defaultValue="+33 1 23 45 67 89" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Adresse</Label>
                  <Input defaultValue="123 Rue de la Paix, 75001 Paris" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Site web</Label>
                  <Input defaultValue="https://acme.com" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={() => handleSave("Entreprise")}>
                  <Save className="w-4 h-4" /> Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Mon profil</CardTitle>
              <CardDescription>Informations personnelles et préférences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-display font-bold text-primary">
                  JD
                </div>
                <div>
                  <p className="font-display font-semibold text-lg">Jean Dupont</p>
                  <p className="text-sm text-muted-foreground">Administrateur</p>
                </div>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input defaultValue="Jean" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input defaultValue="Dupont" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="jean.dupont@acme.com" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input defaultValue="+33 6 12 34 56 78" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Bio</Label>
                  <Textarea placeholder="Quelques mots sur vous..." defaultValue="Responsable formation chez Acme Corp" />
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
              <CardTitle className="font-display">Préférences de notification</CardTitle>
              <CardDescription>Choisissez quand et comment être alerté</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "email" as const, label: "Notifications par email", desc: "Recevoir les alertes par email" },
                { key: "quizComplete" as const, label: "Quiz terminé", desc: "Quand un participant finit un quiz" },
                { key: "newMember" as const, label: "Nouveau membre", desc: "Quand un membre rejoint l'organisation" },
                { key: "weeklyReport" as const, label: "Rapport hebdomadaire", desc: "Résumé des performances chaque lundi" },
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
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="font-display">Changer le mot de passe</CardTitle>
                <CardDescription>Mettez à jour votre mot de passe régulièrement</CardDescription>
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

            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="font-display">Sessions actives</CardTitle>
                <CardDescription>Appareils connectés à votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "Chrome · Windows", location: "Paris, FR", current: true, time: "Maintenant" },
                  { device: "Safari · iPhone", location: "Lyon, FR", current: false, time: "Il y a 2h" },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.current ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      <div>
                        <p className="text-sm font-medium">{session.device}</p>
                        <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm">Déconnecter</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Apparence</CardTitle>
              <CardDescription>Personnalisez l'interface de QuizArena</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
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

export default SettingsTab;
