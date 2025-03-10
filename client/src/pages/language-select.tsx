import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";

const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" }
] as const;

export default function LanguageSelect() {
  const { setLanguage, isLanguageSelected } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLanguageSelected) {
      setLocation("/chat");
    }
  }, [isLanguageSelected, setLocation]);

  return (
    <div className="min-h-screen bg-[#1a1b2e]/95 flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-[#2a2b3e]/80 border-[#4d4da6]/50 shadow-[0_0_15px_rgba(77,77,166,0.3)] animate-glow">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 flex items-center justify-center shadow-[0_0_15px_rgba(77,77,166,0.3)] animate-glow rounded-full bg-[#2a2b3e]/50 p-2">
              <img 
                src="./logo.png" 
                alt="Pickle Mechanic" 
                className="h-20 w-auto"
                onError={(e) => {
                  console.error('Error loading logo:', e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-white/90">Pickle Mechanic</h1>
            <p className="text-white/60 text-center">
              Seleccione su idioma preferido / Choose your preferred language
            </p>
          </div>

          <div className="grid gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setLocation("/chat");
                }}
                className="w-full bg-[#1a1b2e]/50 hover:bg-white/10 border border-white/20"
                variant="outline"
              >
                {lang.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}