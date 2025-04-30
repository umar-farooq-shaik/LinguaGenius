import { useState, useEffect } from "react";

export interface Translation {
  inputText: string;
  outputText: string;
  inputLanguage: string;
  outputLanguage: string;
  timestamp: string;
}

const STORAGE_KEY = "translationHistory";
const MAX_HISTORY_ITEMS = 50;

export function useHistory() {
  const [translationHistory, setTranslationHistory] = useState<Translation[]>(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });

  // Update localStorage when history changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(translationHistory));
  }, [translationHistory]);

  // Save translation to history
  const saveTranslation = (translation: Translation) => {
    setTranslationHistory(prev => {
      // Add to beginning of array
      const newHistory = [translation, ...prev];
      
      // Keep only last MAX_HISTORY_ITEMS items
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  // Clear all history
  const clearHistory = () => {
    setTranslationHistory([]);
  };

  // Restore a translation from history
  const restoreTranslation = (item: Translation) => {
    // Move this item to the top of history list
    setTranslationHistory(prev => {
      const filteredHistory = prev.filter(
        translation => translation.timestamp !== item.timestamp
      );
      return [item, ...filteredHistory];
    });
    
    // Return the item so it can be used to update the translator state
    return item;
  };

  // Remove a specific history item
  const removeHistoryItem = (index: number) => {
    setTranslationHistory(prev => {
      const newHistory = [...prev];
      newHistory.splice(index, 1);
      return newHistory;
    });
  };

  return {
    translationHistory,
    saveTranslation,
    clearHistory,
    restoreTranslation,
    removeHistoryItem
  };
}
