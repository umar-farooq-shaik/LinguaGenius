import { useSpeech } from "@/hooks/use-speech";
import LanguageSelect from "@/components/ui/language-select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VolumeIcon, DownloadIcon, ClipboardIcon, Share2Icon } from "lucide-react";

interface OutputPanelProps {
  outputText: string;
  outputLanguage: string;
  setOutputLanguage: (language: string) => void;
  showNotification: (message: string, icon: string) => void;
}

export default function OutputPanel({
  outputText,
  outputLanguage,
  setOutputLanguage,
  showNotification,
}: OutputPanelProps) {
  const { speak } = useSpeech({});

  // Handle text-to-speech
  const handleTextToSpeech = () => {
    if (!outputText.trim()) {
      showNotification("No text to speak", "ri-error-warning-line");
      return;
    }

    speak(outputText, outputLanguage);
    showNotification("Playing audio...", "ri-volume-up-fill");
  };

  // Handle download translation
  const handleDownload = () => {
    if (!outputText.trim()) {
      showNotification("No translation to download", "ri-error-warning-line");
      return;
    }

    // Create a blob and download link
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation_to_${outputLanguage}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification("Translation downloaded", "ri-download-line");
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (!outputText.trim()) {
      showNotification("No translation to copy", "ri-error-warning-line");
      return;
    }

    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        showNotification("Copied to clipboard", "ri-clipboard-line");
      })
      .catch(() => {
        showNotification("Failed to copy", "ri-error-warning-line");
      });
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div className="w-full sm:w-auto">
          <LanguageSelect
            value={outputLanguage}
            onChange={setOutputLanguage}
            disabled={false}
            includeAuto={false}
          />
        </div>
        
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary btn-hover-effect"
                  onClick={handleTextToSpeech}
                  disabled={!outputText.trim()}
                >
                  <VolumeIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">Listen</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Listen to translation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary btn-hover-effect"
                  onClick={handleCopy}
                  disabled={!outputText.trim()}
                >
                  <ClipboardIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">Copy</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary btn-hover-effect whitespace-nowrap"
                  onClick={handleDownload}
                  disabled={!outputText.trim()}
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download translation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="relative flex-1 min-h-[200px]">
        <Card className="w-full h-full min-h-[220px] p-4 bg-gray-50 dark:bg-background border rounded-md overflow-auto">
          {outputText ? (
            <p className="font-sans leading-relaxed whitespace-pre-wrap">{outputText}</p>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-sm">Translation will appear here</span>
            </div>
          )}
        </Card>
        
        {outputText && (
          <div className="absolute bottom-2 right-3 text-xs bg-white/90 dark:bg-background/80 text-muted-foreground px-2 py-1 rounded-full">
            {outputText.length} characters
          </div>
        )}
        
        {outputText && (
          <div className="absolute top-3 right-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full text-accent-foreground hover:text-primary hover:bg-muted btn-hover-effect"
                    onClick={() => {
                      const shareData = {
                        title: 'LinguaGenius Translation',
                        text: outputText,
                      };
                      
                      if (navigator.share && navigator.canShare(shareData)) {
                        navigator.share(shareData)
                          .then(() => showNotification("Shared successfully", "ri-share-line"))
                          .catch(() => showNotification("Failed to share", "ri-error-warning-line"));
                      } else {
                        handleCopy();
                      }
                    }}
                  >
                    <Share2Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share translation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
