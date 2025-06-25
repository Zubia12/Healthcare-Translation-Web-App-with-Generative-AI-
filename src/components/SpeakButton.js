import React, { useState, useEffect } from 'react';

const SpeakButton = ({ text, language, disabled }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      setError('Speech synthesis is not supported in this browser.');
      return;
    }
    setIsSupported(true);
    setError(null);
  }, []);

  const speak = () => {
    if (!text.trim() || !isSupported) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error('Speech synthesis error:', event.error);
      
      switch (event.error) {
        case 'not-allowed':
          setError('Speech synthesis was blocked. Please check your browser settings.');
          break;
        case 'network':
          setError('Network error during speech synthesis.');
          break;
        case 'synthesis-failed':
          setError('Speech synthesis failed. Please try again.');
          break;
        case 'audio-busy':
          setError('Audio is busy. Please try again.');
          break;
        case 'interrupted':
          setError('Speech was interrupted.');
          break;
        default:
          setError('Speech synthesis error. Please try again.');
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setIsSpeaking(false);
      setError('Failed to start speech synthesis.');
      console.error('Speech synthesis error:', err);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className="btn-secondary opacity-50 cursor-not-allowed touch-manipulation"
        title={error}
      >
        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="hidden sm:inline">Speech Not Supported</span>
        <span className="sm:hidden">Not Supported</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={isSpeaking ? stopSpeaking : speak}
        disabled={disabled || !text.trim()}
        className={`btn-primary flex items-center justify-center touch-manipulation ${
          isSpeaking ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : ''
        } ${disabled || !text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isSpeaking ? 'Stop speaking' : 'Speak translation'}
      >
        {isSpeaking ? (
          <>
            <svg className="w-5 h-5 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h12v16H6z"/>
            </svg>
            <span className="hidden sm:inline">Stop Speaking</span>
            <span className="sm:hidden">Stop</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="hidden sm:inline">Speak Translation</span>
            <span className="sm:hidden">Speak</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-lg p-2 z-10">
          <p className="text-red-800 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SpeakButton; 