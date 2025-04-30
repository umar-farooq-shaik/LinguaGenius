import { useState, useEffect } from "react";
import InputPanel from "./input-panel";
import OutputPanel from "./output-panel";
import ControlPanel from "./control-panel";
import HistoryPanel from "./history-panel";
import ToastNotification from "@/components/ui/toast-notification";
import { useTranslator } from "@/hooks/use-translator";
import { useHistory } from "@/hooks/use-history";

export default function Translator() {
  const {
    inputText,
    setInputText,
    outputText,
    inputLanguage,
    setInputLanguage,
    outputLanguage,
    setOutputLanguage,
    autoDetect,
    setAutoDetect,
    isTranslating,
    translate,
    detectLanguage,
  } = useTranslator();

  const {
    translationHistory,
    saveTranslation,
    clearHistory,
    restoreTranslation,
    removeHistoryItem,
  } = useHistory();

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    icon: "",
  });

  // Show notification with auto-dismiss
  const showNotification = (message: string, icon: string) => {
    setNotification({
      show: true,
      message,
      icon,
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Swap languages function
  const swapLanguages = () => {
    if (autoDetect) {
      showNotification("Cannot swap when auto-detect is enabled", "ri-error-warning-line");
      return;
    }

    // Swap languages
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);

    // Swap text if output has content
    if (outputText) {
      setInputText(outputText);
    }
  };

  // Clear input function
  const clearInput = () => {
    setInputText("");
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      showNotification("Please enter text to translate", "ri-error-warning-line");
      return;
    }

    try {
      // If auto-detect is enabled, first detect the language
      let fromLang = inputLanguage;
      if (autoDetect) {
        const detectedLang = await detectLanguage(inputText);
        if (detectedLang) {
          fromLang = detectedLang;
          setInputLanguage(detectedLang);
        }
      }

      // Translate the text
      const result = await translate(inputText, fromLang, outputLanguage);
      
      if (result) {
        // Save to history if translation was successful
        saveTranslation({
          inputText,
          outputText: result,
          inputLanguage: autoDetect ? "auto" : fromLang,
          outputLanguage,
          timestamp: new Date().toISOString()
        });
        showNotification("Translation complete", "ri-check-line");
      }
    } catch (error) {
      console.error("Translation error:", error);
      showNotification("Translation failed. Please try again.", "ri-error-warning-line");
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        <InputPanel
          inputText={inputText}
          setInputText={setInputText}
          inputLanguage={inputLanguage}
          setInputLanguage={setInputLanguage}
          autoDetect={autoDetect}
          setAutoDetect={setAutoDetect}
          clearInput={clearInput}
          showNotification={showNotification}
        />

        <ControlPanel
          onTranslate={handleTranslate}
          onSwapLanguages={swapLanguages}
          isTranslating={isTranslating}
        />

        <OutputPanel
          outputText={outputText}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          showNotification={showNotification}
        />
      </div>

      {/* Translation History */}
      {translationHistory.length > 0 && (
        <HistoryPanel 
          history={translationHistory.slice(0, 5)}
          onRestore={restoreTranslation}
          onRemove={removeHistoryItem}
          onClearAll={clearHistory}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification 
        show={notification.show}
        message={notification.message}
        icon={notification.icon}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
