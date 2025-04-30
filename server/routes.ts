import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translateText, detectLanguage } from "./translator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, from, to } = req.body;
      
      if (!text || !to) {
        return res.status(400).json({ 
          message: "Missing required parameters" 
        });
      }
      
      const translatedText = await translateText(text, from, to);
      
      // Increment translation count
      await storage.incrementTranslationCount(from, to);
      
      res.json({ translatedText });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ 
        message: "Translation failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Language detection endpoint
  app.post("/api/detect-language", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ 
          message: "Missing text parameter" 
        });
      }
      
      const language = await detectLanguage(text);
      res.json({ language });
    } catch (error) {
      console.error("Language detection error:", error);
      res.status(500).json({ 
        message: "Language detection failed", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats retrieval error:", error);
      res.status(500).json({ 
        message: "Could not retrieve stats", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
