import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en" | "pt" | "fr" | "de";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  initialMessage: string;
  isLanguageSelected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const welcomeMessages = {
  es: "¡Hola! Soy tu mecánico virtual. ¿En qué puedo ayudarte hoy?",
  en: "Hi! I'm your virtual mechanic. How can I help you today?",
  pt: "Olá! Sou seu mecânico virtual. Como posso ajudar você hoje?",
  fr: "Bonjour! Je suis votre mécanicien virtuel. Comment puis-je vous aider aujourd'hui?",
  de: "Hallo! Ich bin Ihr virtueller Mechaniker. Wie kann ich Ihnen heute helfen?"
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage, but don't set isLanguageSelected yet
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "es";
  });

  // Initialize isLanguageSelected to false by default
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);

  // Check localStorage on mount to set isLanguageSelected
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved) {
      setIsLanguageSelected(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    setIsLanguageSelected(true);
  };

  const initialMessage = welcomeMessages[language];

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      initialMessage,
      isLanguageSelected 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}