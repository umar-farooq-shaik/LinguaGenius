import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StatsModal from "@/components/translator/stats-modal";
import { useHistory } from "@/hooks/use-history";
import { MoonIcon, SunIcon, HistoryIcon, BarChartIcon, GlobeIcon } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [showStats, setShowStats] = useState(false);
  const { translationHistory } = useHistory();

  return (
    <header className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shadow-md">
      <div className="flex items-center space-x-3">
        <GlobeIcon className="h-6 w-6 text-primary" strokeWidth={2.5} />
        <h1 className="text-xl font-bold gradient-text">LinguaGenius Translator</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/10 btn-hover-effect"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5 text-accent" />
          ) : (
            <MoonIcon className="h-5 w-5 text-accent" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/10 btn-hover-effect"
          aria-label="Show translation history"
        >
          <HistoryIcon className="h-5 w-5 text-accent" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent/10 btn-hover-effect"
          aria-label="Show statistics"
          onClick={() => setShowStats(true)}
          disabled={translationHistory.length === 0}
        >
          <BarChartIcon className="h-5 w-5 text-accent" />
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
