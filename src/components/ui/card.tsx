import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  isHoverable?: boolean;
  isClickable?: boolean;
}

interface CardSubComponents {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
}

// Main Card component that serves as a container
export const Card: React.FC<CardProps> & CardSubComponents = ({
  children,
  className = '',
  variant = 'default',
  isHoverable = false,
  isClickable = false,
  ...props
}) => {
  // Variant styles mapping
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-md'
  };

  // Interactive styles for hover and click states
  const interactiveStyles = [
    isHoverable && 'transition-shadow duration-200 hover:shadow-lg',
    isClickable && 'cursor-pointer active:scale-[0.98] transition-transform'
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={`
        rounded-xl overflow-hidden
        ${variantStyles[variant]}
        ${interactiveStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card header component for the top section
export const CardHeader = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div 
    className={`p-6 space-y-1.5 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card title component for the main heading
export const CardTitle = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 
    className={`text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

// Card description component for secondary text
export const CardDescription = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p 
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  >
    {children}
  </p>
);

// Card content component for the main content area
export const CardContent = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div 
    className={`p-6 pt-0 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card footer component for the bottom section
export const CardFooter = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div 
    className={`
      flex items-center p-6 pt-0
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

// Assign subcomponents to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;