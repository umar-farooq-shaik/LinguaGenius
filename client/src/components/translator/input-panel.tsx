import { useSpeech } from "@/hooks/use-speech";
import LanguageSelect from "@/components/ui/language-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MicIcon, VolumeIcon, XIcon, TrashIcon, ClipboardIcon } from "lucide-react";

interface InputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  inputLanguage: string;
  setInputLanguage: (language: string) => void;
  autoDetect: boolean;
  setAutoDetect: (autoDetect: boolean) => void;
  clearInput: () => void;
  showNotification: (message: string, icon: string) => void;
}

export default function InputPanel({
  inputText,
  setInputText,
  inputLanguage,
  setInputLanguage,
  autoDetect,
  setAutoDetect,
  clearInput,
  showNotification,
}: InputPanelProps) {
  const { startListening, isListening, stopListening } = useSpeech({
    onSpeechResult: (result) => {
      setInputText(inputText + " " + result);
      showNotification("Speech captured", "ri-check-line");
    },
    onError: (error) => {
      showNotification(error, "ri-error-warning-line");
    },
  });

  const { speak } = useSpeech({});

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setInputLanguage(value);
    if (value === "auto") {
      setAutoDetect(true);
    }
  };

  // Handle auto-detect change
  const handleAutoDetectChange = (checked: boolean) => {
    setAutoDetect(checked);
    if (!checked && inputLanguage === "auto") {
      setInputLanguage("en");
    }
  };

  // Handle speech-to-text
  const handleSpeechToText = () => {
    if (isListening) {
      stopListening();
      showNotification("Stopped listening", "ri-mic-off-line");
    } else {
      startListening();
      showNotification("Listening...", "ri-mic-fill");
    }
  };

  // Handle text-to-speech
  const handleTextToSpeech = () => {
    if (!inputText.trim()) {
      showNotification("No text to speak", "ri-error-warning-line");
      return;
    }

    speak(inputText, inputLanguage);
    showNotification("Playing audio...", "ri-volume-up-fill");
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-auto">
            <LanguageSelect
              value={autoDetect ? "auto" : inputLanguage}
              onChange={handleLanguageChange}
              disabled={autoDetect}
              includeAuto={true}
            />
          </div>
          <div className="flex items-center">
            <Checkbox
              id="autoDetect"
              checked={autoDetect}
              onCheckedChange={handleAutoDetectChange}
              className="h-4 w-4 text-primary"
            />
            <Label htmlFor="autoDetect" className="ml-2 text-sm font-medium text-muted-foreground">
              Auto-detect
            </Label>
          </div>
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
                  disabled={!inputText.trim()}
                >
                  <VolumeIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">Listen</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Listen to input text</p>
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
                  onClick={() => {
                    navigator.clipboard.writeText(inputText);
                    showNotification("Copied to clipboard", "ri-clipboard-line");
                  }}
                  disabled={!inputText.trim()}
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
        </div>
      </div>

      <div className="relative flex-1 min-h-[200px] bg-background rounded-md border">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate..."
          className="font-sans w-full h-full min-h-[220px] p-4 resize-none border-0 focus-visible:ring-1 focus-visible:ring-primary bg-transparent"
        />
        
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {inputText.length} characters
        </div>
        
        <div className="absolute top-2 right-2 flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isListening ? "default" : "ghost"}
                  size="icon"
                  className={`h-8 w-8 rounded-full ${
                    isListening ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={handleSpeechToText}
                >
                  <MicIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isListening ? "Stop listening" : "Start voice input"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-muted"
                  onClick={clearInput}
                  disabled={!inputText.trim()}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear input</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
