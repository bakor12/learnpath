import React, { useState, useRef, useEffect } from 'react';
import { answerQuestion } from '@/services/apiService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Send, RotateCcw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionFormProps {
  docIds: string[];
  documentCount?: number;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ docIds, documentCount = 0 }) => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [charactersLeft, setCharactersLeft] = useState<number>(500);
  const answerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARACTERS = 500;

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [question]);

  // Update characters left counter
  useEffect(() => {
    setCharactersLeft(MAX_CHARACTERS - question.length);
  }, [question]);

  // Scroll to answer when it's received
  useEffect(() => {
    if (answer && answerRef.current) {
      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [answer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const data = await answerQuestion(question, docIds);
      setAnswer(data.answer);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the answer.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setQuestion('');
    setAnswer(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const formatAnswer = (text: string): React.ReactNode => {
    // Simple markdown-like parsing for bold and italic
    const formattedText = text
      .split('\n\n')
      .map((paragraph, i) => {
        // Replace **text** with bold and *text* with italic
        const formattedParagraph = paragraph
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return <p key={i} className="mb-4" dangerouslySetInnerHTML={{ __html: formattedParagraph }} />;
      });

    return <>{formattedText}</>;
  };

  return (
    <div className="space-y-6">
      <div className="card p-5 shadow-md dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-3 text-primary">
          <FileText size={20} />
          <h3 className="font-medium">
            {documentCount > 0 ? `Asking ${documentCount} document${documentCount > 1 ? 's' : ''}` : 'Ask a question'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about these documents?"
              className="form-input w-full pr-8 min-h-[80px] transition-all duration-200 resize-none"
              rows={1}
              maxLength={MAX_CHARACTERS}
              disabled={loading}
            />
            <div className={`absolute right-3 bottom-3 text-xs ${
              charactersLeft < 50 ? 'text-error' : 'text-muted-foreground'
            }`}>
              {charactersLeft}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <button 
              type="button" 
              onClick={resetForm}
              className="btn-secondary !py-2 !px-3 text-sm flex items-center gap-2"
              disabled={loading || (!question && !answer)}
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            
            <motion.button 
              type="submit" 
              className="btn-primary !py-2.5 !px-4 flex items-center gap-2"
              disabled={loading || !question.trim()}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  Get Answer
                  <Send size={16} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="error" className="animate-shake border border-error/30">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {answer && (
          <motion.div 
            ref={answerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card shadow-md p-5 dark:bg-gray-800 animate-fade-in border-l-4 border-l-primary"
          >
            <h4 className="font-semibold mb-4 text-lg flex items-center gap-2 text-primary">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <FileText size={20} />
              </motion.div>
              Answer
            </h4>
            <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
              {formatAnswer(answer)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionForm;