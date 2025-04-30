import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StatsModal from "@/components/translator/stats-modal";
import { useHistory } from "@/hooks/use-history";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [showStats, setShowStats] = useState(false);
  const { translationHistory } = useHistory();

  return (
    <header className="px-4 py-3 border-b border-border flex items-center justify-between bg-card shadow-sm">
      <div className="flex items-center space-x-2">
        <i className="ri-translate-2 text-primary text-xl"></i>
        <h1 className="text-lg font-bold text-foreground">LinguaGenius Translator</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className={`${theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} text-lg`}></i>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent"
          aria-label="Show translation history"
        >
          <i className="ri-history-line text-lg"></i>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent"
          aria-label="Show statistics"
          onClick={() => setShowStats(true)}
          disabled={translationHistory.length === 0}
        >
          <i className="ri-bar-chart-line text-lg"></i>
        </Button>
      </div>
      
      {showStats && (
        <StatsModal 
          isOpen={showStats} 
          onClose={() => setShowStats(false)} 
        />
      )}
    </header>
  );
}
