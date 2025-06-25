export const languages = [
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English'
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español'
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français'
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch'
  },
  {
    code: 'it-IT',
    name: 'Italian',
    nativeName: 'Italiano'
  },
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português'
  },
  {
    code: 'ru-RU',
    name: 'Russian',
    nativeName: 'Русский'
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語'
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어'
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)'
  },
  {
    code: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية'
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी'
  },
  {
    code: 'th-TH',
    name: 'Thai',
    nativeName: 'ไทย'
  },
  {
    code: 'vi-VN',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt'
  },
  {
    code: 'tr-TR',
    name: 'Turkish',
    nativeName: 'Türkçe'
  }
];

export const getLanguageName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

export const getNativeName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.nativeName : code;
}; 