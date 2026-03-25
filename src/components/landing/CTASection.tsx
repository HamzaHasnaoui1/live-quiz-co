import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center bg-gradient-card rounded-3xl border border-border p-12 md:p-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Prêt à transformer vos formations ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Rejoignez des centaines d'entreprises qui utilisent QuizArena pour engager leurs équipes.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 gap-2 shadow-glow-primary"
            onClick={() => navigate("/signup")}
          >
            Créer mon espace <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
