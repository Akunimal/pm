import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendMessageToOpenAI, sendImageToOpenAI } from "../client/src/api/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, imageUrl, language } = req.body;

      const systemPrompt = 
        'Eres un mecánico experto. Responde de forma técnica pero en lenguaje sencillo. ' +
        'Primero pregunta obligatoriamente: marca, modelo y año del vehículo. ' +
        'Luego solicita detalles de síntomas (sonidos, luces del tablero, kilometraje). ' +
        'Finalmente, da 3 posibles causas y soluciones en formato numerado, con consejos de seguridad. ' +
        'Si el usuario sube una foto, analízala técnicamente antes de responder. ' +
        'Solo responde temas mecánicos o descripciones de autos en venta.';

      let response;
      if (imageUrl) {
        response = await sendImageToOpenAI(imageUrl, language);
      } else {
        response = await sendMessageToOpenAI(message, systemPrompt, language);
      }

      res.json({ response });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ message: "Error processing chat request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
