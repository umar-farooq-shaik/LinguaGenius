import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStats } from "@/hooks/use-stats";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { 
    totalTranslations, 
    topLanguages, 
    topLanguagePairs, 
    weekActivity 
  } = useStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Translation Statistics</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <i className="ri-close-line text-xl" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card className="bg-accent p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Translations</h3>
            <p className="text-3xl font-bold text-primary">{totalTranslations}</p>
          </Card>

          <Card className="bg-accent p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Most Used Languages</h3>
            <div className="space-y-2">
              {topLanguages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-foreground">{lang.name}</span>
                  <span className="text-muted-foreground">{lang.count} times</span>
                </div>
              ))}
              {topLanguages.length === 0 && (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
          </Card>

          <Card className="bg-accent p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Common Language Pairs</h3>
            <div className="space-y-2">
              {topLanguagePairs.map((pair, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-foreground">
                    {pair.from} → {pair.to}
                  </span>
                  <span className="text-muted-foreground">{pair.count} times</span>
                </div>
              ))}
              {topLanguagePairs.length === 0 && (
                <p className="text-muted-foreground">No data available</p>
              )}
            </div>
          </Card>

          <Card className="bg-accent p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Translation Activity</h3>
            <p className="text-sm text-muted-foreground mb-2">Last 7 days</p>
            <div className="h-20 flex items-end justify-between">
              {weekActivity.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-primary rounded-t" 
                    style={{ height: `${day.height}px` }}
                  ></div>
                  <span className="text-xs mt-1 text-muted-foreground">{day.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
