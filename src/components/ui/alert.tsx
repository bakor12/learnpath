import React from 'react';
import { motion } from 'framer-motion';

// Define the variants prop type to allow different alert styles
type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

// Alert component that contains the main alert structure
export const Alert = ({
  children,
  variant = 'default',
  className = '',
  icon,
  onClose,
  ...props
}: AlertProps) => {
  // Map variants to Tailwind classes for different alert styles
  const variantStyles: Record<AlertVariant, string> = {
    default: 'bg-gray-100 border-gray-500 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    success: 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`
        relative flex items-start gap-4 p-4 rounded-lg border-l-4
        ${variantStyles[variant]}
        ${className}
      `}
      role="alert"
      {...props}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div className="flex-grow">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          aria-label="Close alert"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

// Alert title component for the heading
export const AlertTitle = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h5 
    className={`font-medium mb-1 ${className}`}
    {...props}
  >
    {children}
  </h5>
);

// Alert description component for the main content
export const AlertDescription = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div 
    className={`text-sm leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </div>
);