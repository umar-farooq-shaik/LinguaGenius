import { useSpeech } from "@/hooks/use-speech";
import LanguageSelect from "@/components/ui/language-select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      setInputText((prev) => prev + " " + result);
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
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <LanguageSelect
            value={autoDetect ? "auto" : inputLanguage}
            onChange={handleLanguageChange}
            disabled={autoDetect}
            includeAuto={true}
          />
          <div className="flex items-center">
            <Checkbox
              id="autoDetect"
              checked={autoDetect}
              onCheckedChange={handleAutoDetectChange}
              className="h-4 w-4"
            />
            <Label htmlFor="autoDetect" className="ml-2 text-sm text-muted-foreground">
              Auto-detect
            </Label>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
                onClick={handleTextToSpeech}
                disabled={!inputText.trim()}
              >
                <i className="ri-volume-up-line text-xl"></i>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Listen to input text</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative flex-1 min-h-[200px]">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate..."
          className="font-mono w-full h-full min-h-[200px] p-4 resize-none"
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {inputText.length} characters
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-2 right-2 p-2 ${
                  isListening ? "text-red-500" : "text-muted-foreground hover:text-primary"
                }`}
                onClick={handleSpeechToText}
              >
                <i className={`${isListening ? "ri-mic-fill" : "ri-mic-line"} text-xl`}></i>
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
                className="absolute top-2 right-12 p-2 text-muted-foreground hover:text-primary"
                onClick={clearInput}
                disabled={!inputText.trim()}
              >
                <i className="ri-close-line text-xl"></i>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear input</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
