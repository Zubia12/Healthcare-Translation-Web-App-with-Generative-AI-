// Note: You'll need to set up your OpenAI API key in environment variables
// Create a .env file in the root directory with: REACT_APP_OPENAI_API_KEY=your_api_key_here

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Language code mapping for OpenAI API
const languageCodeMap = {
  'en-US': 'English',
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese',
  'ru-RU': 'Russian',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'zh-CN': 'Chinese',
  'ar-SA': 'Arabic',
  'hi-IN': 'Hindi',
  'th-TH': 'Thai',
  'vi-VN': 'Vietnamese',
  'tr-TR': 'Turkish'
};

export const translateText = async (text, sourceLanguage, targetLanguage) => {
  if (!text.trim()) {
    throw new Error('No text to translate');
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your environment variables.');
  }

  const sourceLang = languageCodeMap[sourceLanguage] || sourceLanguage;
  const targetLang = languageCodeMap[targetLanguage] || targetLanguage;

  try {
    // Add timeout for mobile networks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using GPT-4o-mini for cost efficiency, can be changed to gpt-4o
        messages: [
          {
            role: 'system',
            content: `You are a professional healthcare translator. Translate the following text from ${sourceLang} to ${targetLang}. 
            Maintain the medical terminology accuracy and ensure the translation is natural and appropriate for healthcare communication. 
            Only return the translated text, nothing else. Do not include any explanations or additional text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 1000,
        temperature: 0.3 // Lower temperature for more consistent translations
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again.');
      } else {
        throw new Error(`Translation failed: ${errorMessage}`);
      }
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error('No translation received from API');
    }

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Translation timed out. Please check your internet connection and try again.');
    } else if (error.message.includes('API key')) {
      throw new Error('OpenAI API key is missing or invalid. Please check your configuration.');
    } else if (error.message.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please check your OpenAI account.');
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }
};

// Fallback translation function using a simple dictionary (for demo purposes)
export const fallbackTranslate = (text, sourceLanguage, targetLanguage) => {
  // This is a very basic fallback - in a real app, you might use a different translation service
  const commonPhrases = {
    'hello': {
      'es-ES': 'hola',
      'fr-FR': 'bonjour',
      'de-DE': 'hallo',
      'it-IT': 'ciao',
      'pt-BR': 'olá',
      'ru-RU': 'привет',
      'ja-JP': 'こんにちは',
      'ko-KR': '안녕하세요',
      'zh-CN': '你好',
      'ar-SA': 'مرحبا',
      'hi-IN': 'नमस्ते',
      'th-TH': 'สวัสดี',
      'vi-VN': 'xin chào',
      'tr-TR': 'merhaba'
    },
    'thank you': {
      'es-ES': 'gracias',
      'fr-FR': 'merci',
      'de-DE': 'danke',
      'it-IT': 'grazie',
      'pt-BR': 'obrigado',
      'ru-RU': 'спасибо',
      'ja-JP': 'ありがとう',
      'ko-KR': '감사합니다',
      'zh-CN': '谢谢',
      'ar-SA': 'شكرا',
      'hi-IN': 'धन्यवाद',
      'th-TH': 'ขอบคุณ',
      'vi-VN': 'cảm ơn',
      'tr-TR': 'teşekkürler'
    },
    'pain': {
      'es-ES': 'dolor',
      'fr-FR': 'douleur',
      'de-DE': 'schmerz',
      'it-IT': 'dolore',
      'pt-BR': 'dor',
      'ru-RU': 'боль',
      'ja-JP': '痛み',
      'ko-KR': '통증',
      'zh-CN': '疼痛',
      'ar-SA': 'ألم',
      'hi-IN': 'दर्द',
      'th-TH': 'ความเจ็บปวด',
      'vi-VN': 'đau',
      'tr-TR': 'ağrı'
    },
    'doctor': {
      'es-ES': 'médico',
      'fr-FR': 'médecin',
      'de-DE': 'arzt',
      'it-IT': 'medico',
      'pt-BR': 'médico',
      'ru-RU': 'врач',
      'ja-JP': '医師',
      'ko-KR': '의사',
      'zh-CN': '医生',
      'ar-SA': 'طبيب',
      'hi-IN': 'डॉक्टर',
      'th-TH': 'แพทย์',
      'vi-VN': 'bác sĩ',
      'tr-TR': 'doktor'
    }
  };

  const lowerText = text.toLowerCase();
  let translatedText = text;

  for (const [phrase, translations] of Object.entries(commonPhrases)) {
    if (lowerText.includes(phrase) && translations[targetLanguage]) {
      translatedText = translatedText.replace(new RegExp(phrase, 'gi'), translations[targetLanguage]);
    }
  }

  return translatedText;
}; 