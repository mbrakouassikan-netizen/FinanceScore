import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  href?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  href,
  ariaLabel,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium rounded-pill transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary';
  
  const variantClasses = {
    primary: 'bg-accent-primary text-black hover:bg-opacity-90 focus:ring-accent-primary',
    secondary: 'bg-accent-secondary text-white hover:bg-opacity-90 focus:ring-accent-secondary',
    outline: 'border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black focus:ring-accent-primary',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[48px]',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </>
  );

  const MotionButton = motion.button;

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${classes} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={disabled ? undefined : onClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <MotionButton
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      {buttonContent}
    </MotionButton>
  );
};
