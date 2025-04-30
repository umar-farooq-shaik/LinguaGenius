import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import { Translation } from "@/hooks/use-history";

interface HistoryPanelProps {
  history: Translation[];
  onRestore: (item: Translation) => void;
  onRemove: (index: number) => void;
  onClearAll: () => void;
}

export default function HistoryPanel({
  history,
  onRestore,
  onRemove,
  onClearAll,
}: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-foreground">Recent Translations</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-destructive"
          onClick={onClearAll}
        >
          Clear History
        </Button>
      </div>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <Card key={index} className="p-4 border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-accent rounded text-muted-foreground">
                  {item.inputLanguage === "auto" ? "auto-detect" : item.inputLanguage} → {item.outputLanguage}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeDate(item.timestamp)}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={() => onRestore(item)}
                >
                  <i className="ri-arrow-go-back-line text-sm"></i>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(index)}
                >
                  <i className="ri-delete-bin-line text-sm"></i>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-sm text-foreground">
                <p className="line-clamp-2">{item.inputText}</p>
              </div>
              <div className="text-sm text-foreground">
                <p className="line-clamp-2">{item.outputText}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
