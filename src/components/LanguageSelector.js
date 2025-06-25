import React from 'react';

const LanguageSelector = ({ label, value, onChange, languages }) => {
  return (
    <div className="card">
      <label htmlFor={`language-${label.toLowerCase().replace(' ', '-')}`} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        id={`language-${label.toLowerCase().replace(' ', '-')}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-field touch-manipulation"
        aria-label={`Select ${label.toLowerCase()}`}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector; 