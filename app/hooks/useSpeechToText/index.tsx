import { useState, useRef, useEffect } from "react";

// Temporary fix for missing speech recognition types
type SpeechRecognition = any;

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
  }
}

export const useSpeechToText = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition is not supported in this browser");
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.lang = "pl-PL";

    if ("webkitSpeechGrammarList" in window) {
      const speechRecognitionList = new window.webkitSpeechGrammarList();
      speechRecognitionList.addFromString("#JSGF V1.0;", 1);
      recognition.grammars = speechRecognitionList;
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        interimTranscript += transcript;
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      setListening(false);
      setTranscript("");
    };

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return { transcript, startListening, stopListening, listening };
};
