import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import VoiceInput from './components/VoiceInput';
import TranscriptDisplay from './components/TranscriptDisplay';
import SpeakButton from './components/SpeakButton';
import ErrorBoundary from './components/ErrorBoundary';
import { translateText } from './utils/translation';
import { languages } from './utils/languages';

function App() {
  const [inputLanguage, setInputLanguage] = useState('en-US');
  const [outputLanguage, setOutputLanguage] = useState('es-ES');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const handleTranslation = useCallback(async () => {
    if (!originalText.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      const translated = await translateText(originalText, inputLanguage, outputLanguage);
      setTranslatedText(translated);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [originalText, inputLanguage, outputLanguage]);

  // Auto-translate when original text changes
  useEffect(() => {
    if (originalText.trim() && inputLanguage !== outputLanguage) {
      handleTranslation();
    } else if (originalText.trim() && inputLanguage === outputLanguage) {
      setTranslatedText(originalText);
    }
  }, [originalText, inputLanguage, outputLanguage, handleTranslation]);

  const handleVoiceInput = (text) => {
    setOriginalText(text);
  };

  const clearAll = () => {
    setOriginalText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-blue-50">
        <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
          <Header />
          
          <div className="space-y-4 sm:space-y-6">
            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <LanguageSelector
                label="Input Language"
                value={inputLanguage}
                onChange={setInputLanguage}
                languages={languages}
              />
              <LanguageSelector
                label="Output Language"
                value={outputLanguage}
                onChange={setOutputLanguage}
                languages={languages}
              />
            </div>

            {/* Voice Input */}
            <VoiceInput
              language={inputLanguage}
              onTextReceived={handleVoiceInput}
              isListening={isListening}
              setIsListening={setIsListening}
            />

            {/* Transcript Display */}
            <TranscriptDisplay
              originalText={originalText}
              translatedText={translatedText}
              isTranslating={isTranslating}
              inputLanguage={inputLanguage}
              outputLanguage={outputLanguage}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <SpeakButton
                text={translatedText}
                language={outputLanguage}
                disabled={!translatedText.trim()}
              />
              <button
                onClick={clearAll}
                className="btn-secondary touch-manipulation"
                disabled={!originalText.trim() && !translatedText.trim()}
              >
                Clear All
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-2">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App; 