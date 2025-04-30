import { useSpeech } from "@/hooks/use-speech";
import LanguageSelect from "@/components/ui/language-select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <LanguageSelect
          value={outputLanguage}
          onChange={setOutputLanguage}
          disabled={false}
          includeAuto={false}
        />
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={handleTextToSpeech}
                  disabled={!outputText.trim()}
                >
                  <i className="ri-volume-up-line text-xl"></i>
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
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={handleDownload}
                  disabled={!outputText.trim()}
                >
                  <i className="ri-download-line text-xl"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download translation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={handleCopy}
                  disabled={!outputText.trim()}
                >
                  <i className="ri-clipboard-line text-xl"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="relative flex-1 min-h-[200px]">
        <Card className="font-mono w-full h-full min-h-[200px] p-4 bg-accent overflow-auto">
          {outputText || (
            <span className="text-muted-foreground">Translation will appear here</span>
          )}
        </Card>
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {outputText.length} characters
        </div>
      </div>
    </div>
  );
}
