// src/components/ui/Translator.tsx

import React, { useState } from 'react';
import { translateText } from '@/services/apiService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import Alert
import { Loader2 } from 'lucide-react';

const Translator: React.FC = () => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {    if (!text.trim()) {
        setError('Please enter text to translate.');
        return;
      }
      setLoading(true);
      setError(null);
      setTranslatedText('');
      try {
        const data = await translateText(text, targetLanguage);
        setTranslatedText(data.translated_text);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred during translation.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          className="form-input w-full"
          rows={3}
        />
        <div className="flex items-center gap-4">
          <label htmlFor="targetLanguage" className="font-medium">
            Target Language:
          </label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="form-input"
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            {/* Add more languages as needed */}
          </select>
          <button onClick={handleTranslate} className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </button>
        </div>
  
        {error && (
          <Alert variant="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
  
        {translatedText && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h4 className="font-semibold mb-2">Translated Text:</h4>
            <p>{translatedText}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default Translator;