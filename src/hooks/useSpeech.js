import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Web Speech API wrapper for speech-to-text.
 * Falls back gracefully if the browser doesn't support it.
 */
export function useSpeech({ onResult, lang = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported] = useState(
    () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const recognitionRef = useRef(null);
  // Keep onResult in a ref so the effect never needs to restart when it changes
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => (prev + ' ' + finalTranscript).trim());
        onResultRef.current?.(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, lang]); // onResult removed from deps — handled via ref above

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    setError(null);
    setIsListening(true);
    recognitionRef.current.start();
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
