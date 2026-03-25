import { motion } from "framer-motion";
import { Brain, Users, BarChart3, Shield, Smartphone, Timer } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Quiz Builder puissant",
    description: "QCM, Vrai/Faux, Sondages. Timer configurable, points personnalisables, images.",
    color: "text-primary",
  },
  {
    icon: Timer,
    title: "Sessions temps réel",
    description: "Lancez une session avec un PIN unique. Classement dynamique après chaque question.",
    color: "text-game-blue",
  },
  {
    icon: Users,
    title: "Multi-entreprise (SaaS)",
    description: "Chaque entreprise a son espace isolé. Rôles, permissions et invitations par email.",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Statistiques détaillées",
    description: "Taux de bonnes réponses, scores moyens, analyse par question et par session.",
    color: "text-game-orange",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description: "Les participants rejoignent depuis leur téléphone. Interface optimisée pour chaque écran.",
    color: "text-game-yellow",
  },
  {
    icon: Shield,
    title: "Sécurité renforcée",
    description: "Authentification sécurisée, isolation des données, contrôle d'accès granulaire.",
    color: "text-game-red",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Tout ce qu'il faut pour <span className="text-primary">engager</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une plateforme complète pour créer, animer et analyser vos quiz d'entreprise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors group"
            >
              <feature.icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
