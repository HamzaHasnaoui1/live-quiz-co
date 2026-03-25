import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">QuizArena</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/join")}>
            Rejoindre
          </Button>
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Connexion
          </Button>
          <Button onClick={() => navigate("/signup")}>
            S'inscrire
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
