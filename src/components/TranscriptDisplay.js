import React from 'react';

const TranscriptDisplay = ({ 
  originalText, 
  translatedText, 
  isTranslating, 
  inputLanguage, 
  outputLanguage 
}) => {
  const getLanguageName = (code) => {
    const languageMap = {
      'en-US': 'English',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German',
      'it-IT': 'Italian',
      'pt-BR': 'Portuguese',
      'ru-RU': 'Russian',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean',
      'zh-CN': 'Chinese (Simplified)',
      'ar-SA': 'Arabic',
      'hi-IN': 'Hindi',
      'th-TH': 'Thai',
      'vi-VN': 'Vietnamese',
      'tr-TR': 'Turkish'
    };
    return languageMap[code] || code;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Original Text */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Original Text
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {getLanguageName(inputLanguage)}
          </span>
        </div>
        <div className="min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 bg-gray-50 rounded-lg border">
          {originalText ? (
            <p className="text-gray-800 leading-relaxed text-balance text-sm sm:text-base break-words">
              {originalText}
            </p>
          ) : (
            <p className="text-gray-400 italic text-sm sm:text-base">
              Speak or type to see the original text here...
            </p>
          )}
        </div>
      </div>

      {/* Translated Text */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Translation
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {getLanguageName(outputLanguage)}
          </span>
        </div>
        <div className="min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 bg-healthcare-50 rounded-lg border border-healthcare-200 relative">
          {isTranslating ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-healthcare-600"></div>
                <span className="text-healthcare-600 text-sm sm:text-base">Translating...</span>
              </div>
            </div>
          ) : translatedText ? (
            <p className="text-gray-800 leading-relaxed text-balance text-sm sm:text-base break-words">
              {translatedText}
            </p>
          ) : (
            <p className="text-gray-400 italic text-sm sm:text-base">
              Translation will appear here...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay; 