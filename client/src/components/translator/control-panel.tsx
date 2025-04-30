import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="flex lg:flex-col justify-center items-center gap-4 py-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onTranslate}
              className="bg-primary text-white p-3 rounded-full shadow-md hover:bg-primary/90 transition-colors duration-200"
              size="icon"
              disabled={isTranslating}
            >
              {isTranslating ? (
                <i className="ri-loader-4-line animate-spin text-xl"></i>
              ) : (
                <i className="ri-translate-2 text-xl"></i>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Translate</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSwapLanguages}
              className="bg-secondary text-secondary-foreground p-3 rounded-full shadow-md hover:bg-secondary/90 transition-colors duration-200"
              size="icon"
              disabled={isTranslating}
            >
              <i className="ri-swap-line text-xl"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Swap languages</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
