import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export function useTranslator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("es");
  const [autoDetect, setAutoDetect] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Translate text
  const translate = async (text: string, from: string, to: string): Promise<string | null> => {
    if (!text.trim()) return null;
    
    setIsTranslating(true);
    
    try {
      const response = await apiRequest("POST", "/api/translate", {
        text,
        from,
        to
      });
      
      const data = await response.json();
      setOutputText(data.translatedText);
      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };

  // Detect language
  const detectLanguage = async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;
    
    try {
      const response = await apiRequest("POST", "/api/detect-language", {
        text
      });
      
      const data = await response.json();
      return data.language;
    } catch (error) {
      console.error("Language detection error:", error);
      return null;
    }
  };

  return {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    inputLanguage,
    setInputLanguage,
    outputLanguage,
    setOutputLanguage,
    autoDetect,
    setAutoDetect,
    isTranslating,
    translate,
    detectLanguage
  };
}
