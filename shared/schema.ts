import { z } from "zod";

// Translation interface for history storage on client
export interface Translation {
  inputText: string;
  outputText: string;
  inputLanguage: string;
  outputLanguage: string;
  timestamp: string;
}

// Translation statistics for server-side tracking
export interface TranslationStats {
  totalTranslations: number;
  topLanguages: Array<{
    language: string;
    count: number;
  }>;
  topPairs: Array<{
    from: string;
    to: string;
    count: number;
  }>;
}

// Translation schema
export const translations = z.object({
  inputText: z.string(),
  outputText: z.string(),
  inputLanguage: z.string(),
  outputLanguage: z.string(),
  timestamp: z.string()
});

// Translation stats schema
export const stats = z.object({
  totalTranslations: z.number(),
  topLanguages: z.array(
    z.object({
      language: z.string(),
      count: z.number()
    })
  ),
  topPairs: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      count: z.number()
    })
  )
});
