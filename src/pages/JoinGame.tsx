import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const JoinGame = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");
  const [step, setStep] = useState<"pin" | "nickname">("pin");

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) setStep("nickname");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/play");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center"
      >
        <div
          className="inline-flex items-center gap-2 cursor-pointer mb-10"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">QuizArena</span>
        </div>

        {step === "pin" ? (
          <motion.form
            key="pin"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handlePinSubmit}
            className="space-y-6"
          >
            <h1 className="font-display text-4xl font-bold">Entrez le PIN</h1>
            <Input
              className="text-center text-3xl font-display tracking-[0.5em] py-6 bg-muted border-border"
              placeholder="000000"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              autoFocus
            />
            <Button
              type="submit"
              className="w-full py-5 shadow-glow-primary"
              disabled={pin.length !== 6}
            >
              Continuer
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="nickname"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleJoin}
            className="space-y-6"
          >
            <h1 className="font-display text-4xl font-bold">Votre pseudo</h1>
            <Input
              className="text-center text-xl py-6 bg-muted border-border"
              placeholder="Ex: SuperPlayer"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <Button
              type="submit"
              className="w-full py-5 shadow-glow-primary"
              disabled={!nickname.trim()}
            >
              Rejoindre 🚀
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default JoinGame;
