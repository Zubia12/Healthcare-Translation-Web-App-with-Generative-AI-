import React, { useState, useEffect, useRef } from 'react';

const VoiceInput = ({ language, onTextReceived, isListening, setIsListening }) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript + interimTranscript;
      setTranscript(fullTranscript);
      
      if (finalTranscript) {
        onTextReceived(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try speaking again.');
          break;
        case 'audio-capture':
          setError('Audio capture failed. Please check your microphone permissions.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access and try again.');
          break;
        case 'network':
          setError('Network error. Please check your internet connection.');
          break;
        case 'service-not-allowed':
          setError('Speech recognition service not allowed. Please check your browser settings.');
          break;
        default:
          setError('Speech recognition error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTextReceived, setIsListening]);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setError(null);
      recognitionRef.current?.start();
    }
  };

  const handleManualInput = (e) => {
    const text = e.target.value;
    setTranscript(text);
    onTextReceived(text);
  };

  if (!isSupported) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <textarea
            placeholder="Type your message here..."
            value={transcript}
            onChange={handleManualInput}
            className="input-field min-h-[120px] resize-none text-base"
            rows="4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="text-center">
        <button
          onClick={toggleListening}
          disabled={!isSupported}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 touch-manipulation ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow'
              : 'bg-healthcare-600 hover:bg-healthcare-700 active:bg-healthcare-800'
          } text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-healthcare-300`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h12v16H6z"/>
            </svg>
          ) : (
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
        
        <p className="text-sm text-gray-600 mb-4 px-2">
          {isListening ? 'Listening... Speak now' : 'Tap to start speaking'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 mx-2">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <textarea
          placeholder="Your speech will appear here, or type manually..."
          value={transcript}
          onChange={handleManualInput}
          className="input-field min-h-[120px] resize-none text-base"
          rows="4"
        />
      </div>
    </div>
  );
};

export default VoiceInput; 