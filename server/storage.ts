import { translations, stats, type Translation, type TranslationStats } from "@shared/schema";

// Define the storage interface for our application
export interface IStorage {
  incrementTranslationCount(fromLang: string, toLang: string): Promise<void>;
  getStats(): Promise<TranslationStats>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private translationCounts: Map<string, number>;
  private languagePairCounts: Map<string, number>;
  private totalTranslations: number;

  constructor() {
    this.translationCounts = new Map();
    this.languagePairCounts = new Map();
    this.totalTranslations = 0;
  }

  // Increment the count for a language pair translation
  async incrementTranslationCount(fromLang: string, toLang: string): Promise<void> {
    // Increment total translations
    this.totalTranslations++;

    // Increment individual language counts
    this.translationCounts.set(
      fromLang, 
      (this.translationCounts.get(fromLang) || 0) + 1
    );
    
    this.translationCounts.set(
      toLang, 
      (this.translationCounts.get(toLang) || 0) + 1
    );

    // Increment language pair count
    const pairKey = `${fromLang}-${toLang}`;
    this.languagePairCounts.set(
      pairKey, 
      (this.languagePairCounts.get(pairKey) || 0) + 1
    );
  }

  // Get translation stats
  async getStats(): Promise<TranslationStats> {
    // Convert Maps to arrays, sort by count, and take top 5
    const topLanguages = [...this.translationCounts.entries()]
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topPairs = [...this.languagePairCounts.entries()]
      .map(([pair, count]) => {
        const [from, to] = pair.split('-');
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalTranslations: this.totalTranslations,
      topLanguages,
      topPairs
    };
  }
}

// Create and export a singleton instance
export const storage = new MemStorage();
