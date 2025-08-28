import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 
      rounded-lg font-medium transition-smooth
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      border font-body
    `;

    const variants = {
      primary: `
        bg-[var(--primary)] text-[var(--text-inverse)] border-[var(--primary)]
        hover:bg-[var(--primary-alt)] hover:border-[var(--primary-alt)]
        focus:ring-[var(--primary)]
      `,
      secondary: `
        bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border)]
        hover:bg-[var(--border)] hover:text-[var(--text-primary)]
        focus:ring-[var(--primary)]
      `,
      outline: `
        bg-transparent text-[var(--text-primary)] border-[var(--border)]
        hover:bg-[var(--surface-elevated)] hover:border-[var(--primary)]
        focus:ring-[var(--primary)]
      `,
      ghost: `
        bg-transparent text-[var(--text-secondary)] border-transparent
        hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]
        focus:ring-[var(--primary)]
      `,
      danger: `
        bg-[var(--error)] text-[var(--text-inverse)] border-[var(--error)]
        hover:opacity-90
        focus:ring-[var(--error)]
      `
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps };
