import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRightIcon, ArrowLeftRightIcon, Loader2Icon } from "lucide-react";

interface ControlPanelProps {
  onTranslate: () => void;
  onSwapLanguages: () => void;
  isTranslating: boolean;
}

export default function ControlPanel({
  onTranslate,
  onSwapLanguages,
  isTranslating,
}: ControlPanelProps) {
  return (
    <div className="flex lg:flex-col items-center justify-center gap-4 py-6 lg:py-0">
      <div className="flex flex-col items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onTranslate}
                className="w-14 h-14 rounded-full shadow-lg btn-hover-effect bg-gradient-to-r from-primary to-accent text-primary-foreground border-0"
                size="icon"
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                ) : (
                  <ArrowRightIcon className="h-6 w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-primary text-primary-foreground border-primary">
              <p>Translate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-xs font-medium text-muted-foreground">Translate</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSwapLanguages}
                variant="outline"
                className="w-10 h-10 rounded-full bg-background hover:bg-muted border-primary/20 hover:border-primary/50 btn-hover-effect"
                size="icon"
                disabled={isTranslating}
              >
                <ArrowLeftRightIcon className="h-4 w-4 text-accent" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Swap languages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <span className="text-xs font-medium text-muted-foreground">Swap</span>
      </div>
    </div>
  );
}
