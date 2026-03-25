import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-game-blue/10 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Plateforme de quiz interactifs en temps réel</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Rendez vos formations{" "}
          <span className="text-gradient-hero">inoubliables</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Créez des quiz interactifs, animez des sessions en direct et mesurez l'engagement de vos équipes — le tout dans une plateforme SaaS multi-entreprise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="text-lg px-8 py-6 shadow-glow-primary"
            onClick={() => navigate("/signup")}
          >
            Commencer gratuitement
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 gap-2"
            onClick={() => navigate("/join")}
          >
            <Play className="w-5 h-5" />
            Rejoindre une session
          </Button>
        </motion.div>

        {/* Game preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="bg-gradient-card rounded-2xl border border-border p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">Question 3/10</span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">15 participants</span>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-semibold mb-8 text-center">
              Quelle est la capitale de l'Australie ?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="game-answer-1 rounded-xl p-4 text-center font-semibold text-foreground cursor-pointer hover:scale-[1.02] transition-transform">Sydney</div>
              <div className="game-answer-2 rounded-xl p-4 text-center font-semibold text-foreground cursor-pointer hover:scale-[1.02] transition-transform">Melbourne</div>
              <div className="game-answer-3 rounded-xl p-4 text-center font-semibold text-foreground cursor-pointer hover:scale-[1.02] transition-transform shadow-glow-primary">Canberra ✓</div>
              <div className="game-answer-4 rounded-xl p-4 text-center font-semibold text-foreground cursor-pointer hover:scale-[1.02] transition-transform">Perth</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
