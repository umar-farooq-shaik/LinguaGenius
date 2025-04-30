import { useState, useEffect, useRef } from "react";

interface UseSpeechProps {
  onSpeechResult?: (result: string) => void;
  onError?: (error: string) => void;
}

export function useSpeech({ onSpeechResult, onError }: UseSpeechProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synth = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
    }
  }, []);

  // Start speech recognition
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      onError?.("Speech recognition not supported in this browser");
      return;
    }

    try {
      // Clean up any existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Create a new recognition instance
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        if (onSpeechResult) {
          onSpeechResult(result);
        }
      };

      recognition.onerror = (event) => {
        if (onError) {
          onError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    } catch (error) {
      onError?.("Error initializing speech recognition");
      setIsListening(false);
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text-to-speech function
  const speak = (text: string, lang: string = "en") => {
    if (!synth.current) {
      onError?.("Speech synthesis not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    synth.current.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Set language

    // Optional error handling
    utterance.onerror = (event) => {
      onError?.(`Speech synthesis error: ${event.error}`);
    };

    // Speak the text
    synth.current.speak(utterance);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    speak
  };
}
