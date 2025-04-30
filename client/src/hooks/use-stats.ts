import { useEffect, useState } from "react";
import { useHistory, Translation } from "./use-history";
import { getLanguageName } from "@/lib/languages";

type TopLanguage = {
  name: string;
  count: number;
};

type LanguagePair = {
  from: string;
  to: string;
  count: number;
};

type DayActivity = {
  label: string;
  count: number;
  height: number;
};

export function useStats() {
  const { translationHistory } = useHistory();
  const [topLanguages, setTopLanguages] = useState<TopLanguage[]>([]);
  const [topLanguagePairs, setTopLanguagePairs] = useState<LanguagePair[]>([]);
  const [weekActivity, setWeekActivity] = useState<DayActivity[]>([]);

  useEffect(() => {
    if (translationHistory.length > 0) {
      // Calculate top languages
      calculateTopLanguages(translationHistory);
      
      // Calculate top language pairs
      calculateTopLanguagePairs(translationHistory);
      
      // Calculate week activity
      calculateWeekActivity(translationHistory);
    }
  }, [translationHistory]);

  // Calculate most used languages
  const calculateTopLanguages = (history: Translation[]) => {
    const languages: Record<string, number> = {};
    
    // Count occurrences of each language
    history.forEach(item => {
      const inputLang = item.inputLanguage === "auto" ? "auto-detect" : item.inputLanguage;
      const outputLang = item.outputLanguage;
      
      languages[inputLang] = (languages[inputLang] || 0) + 1;
      languages[outputLang] = (languages[outputLang] || 0) + 1;
    });
    
    // Convert to array and sort
    const result = Object.entries(languages)
      .map(([code, count]) => ({ 
        name: code === "auto-detect" ? "Auto Detect" : getLanguageName(code),
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    setTopLanguages(result);
  };

  // Calculate common language pairs
  const calculateTopLanguagePairs = (history: Translation[]) => {
    const pairs: Record<string, number> = {};
    
    // Count occurrences of each language pair
    history.forEach(item => {
      const pair = `${item.inputLanguage}-${item.outputLanguage}`;
      pairs[pair] = (pairs[pair] || 0) + 1;
    });
    
    // Convert to array and sort
    const result = Object.entries(pairs)
      .map(([pair, count]) => {
        const [from, to] = pair.split('-');
        return { 
          from: from === "auto" ? "Auto Detect" : getLanguageName(from),
          to: getLanguageName(to),
          count 
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    setTopLanguagePairs(result);
  };

  // Calculate week activity
  const calculateWeekActivity = (history: Translation[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const result: DayActivity[] = [];
    
    // Create counts for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Count translations on this day
      const count = history.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate.toDateString() === date.toDateString();
      }).length;
      
      // Calculate bar height (max 60px)
      const height = count ? Math.max(10, Math.min(60, count * 15)) : 5;
      
      result.push({
        label: days[(dayOfWeek - i + 7) % 7],
        count,
        height
      });
    }
    
    setWeekActivity(result);
  };

  return {
    totalTranslations: translationHistory.length,
    topLanguages,
    topLanguagePairs,
    weekActivity
  };
}
