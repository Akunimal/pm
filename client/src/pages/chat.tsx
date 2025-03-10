import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  imageUrl?: string;
}

const translations = {
  es: {
    tip: "Asegúrate de que la imagen esté enfocada y se vean claramente los componentes del motor o vehículo.",
    cancel: "Cancelar",
    send: "Enviar Imagen",
    upload: "Subir Foto",
    capture: "Tomar Foto",
    placeholder: "Escribe tu consulta mecánica..."
  },
  en: {
    tip: "Make sure the image is focused and the engine or vehicle components are clearly visible.",
    cancel: "Cancel",
    send: "Send Image",
    upload: "Upload Photo",
    capture: "Take Photo",
    placeholder: "Write your mechanical query..."
  },
  pt: {
    tip: "Certifique-se de que a imagem esteja focada e que os componentes do motor ou veículo estejam claramente visíveis.",
    cancel: "Cancelar",
    send: "Enviar Imagem",
    upload: "Enviar Foto",
    capture: "Tirar Foto",
    placeholder: "Escreva sua consulta mecânica..."
  },
  fr: {
    tip: "Assurez-vous que l'image est nette et que les composants du moteur ou du véhicule sont bien visibles.",
    cancel: "Annuler",
    send: "Envoyer l'image",
    upload: "Télécharger Photo",
    capture: "Prendre une Photo",
    placeholder: "Écrivez votre requête mécanique..."
  },
  de: {
    tip: "Stelle sicher, dass das Bild scharf ist und die Motor- oder Fahrzeugteile gut sichtbar sind.",
    cancel: "Abbrechen",
    send: "Bild Senden",
    upload: "Foto Hochladen",
    capture: "Foto Aufnehmen",
    placeholder: "Schreiben Sie Ihre mechanische Anfrage..."
  }
};

export default function ChatPage() {
  const { toast } = useToast();
  const { language, initialMessage } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: Date.now().toString(),
          content: initialMessage,
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage]);

  const handleSendMessage = async () => {
    if (!input.trim() && !imagePreview) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      imageUrl: imagePreview || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setImagePreview(null);
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: input,
        imageUrl: imagePreview,
        language
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date()
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Implementation for camera capture would go here
      // For now, we'll just use file upload
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1b2e]/95 backdrop-blur-xl">
      {/* Header section with logo */}
      <div className="flex flex-col items-center py-4 border-b border-white/10">
        <div className="w-16 h-16 flex items-center justify-center shadow-[0_0_15px_rgba(77,77,166,0.3)] animate-glow rounded-full bg-[#2a2b3e]/50 p-2">
          <img 
            src="./logo.png" 
            alt="Pickle Mechanic" 
            className="h-12 w-auto"
            onError={(e) => {
              console.error('Error loading logo:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-2xl font-bold mt-2 text-white/90">Pickle Mechanic</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-[80%] p-3 backdrop-blur-md border ${
                message.role === "user"
                  ? "bg-primary/80 text-primary-foreground border-white/10"
                  : "bg-[#2a2b3e]/80 border-[#4d4da6]/50 shadow-[0_0_15px_rgba(77,77,166,0.3)] animate-glow"
              }`}
            >
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded mb-2"
                />
              )}
              <p className="leading-relaxed">{message.content}</p>
            </Card>
          </div>
        ))}
      </div>

      {imagePreview && (
        <div className="p-4 border-t border-white/10 bg-[#2a2b3e]/50 backdrop-blur-md">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-[200px] w-auto rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-90 hover:opacity-100"
              onClick={() => setImagePreview(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{t.tip}</p>
        </div>
      )}

      <div className="p-4 border-t border-white/10 bg-[#2a2b3e]/50 backdrop-blur-md">
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            disabled={isLoading}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="bg-[#1a1b2e]/50 border-white/20"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imageUpload"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById("imageUpload")?.click()}
            className="bg-[#1a1b2e]/50 border-white/20 hover:bg-white/10"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCameraCapture}
            className="bg-[#1a1b2e]/50 border-white/20 hover:bg-white/10"
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-primary/80 hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}