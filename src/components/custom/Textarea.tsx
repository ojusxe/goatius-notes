import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={id}
            className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            `
              w-full px-4 py-3 rounded-lg border resize-y
              bg-[var(--surface)] text-[var(--text-primary)]
              placeholder:text-[var(--text-tertiary)]
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[120px]
            `,
            error 
              ? 'border-[var(--error)] focus:ring-[var(--error)]' 
              : 'border-[var(--border)] focus:ring-[var(--primary)]',
            className
          )}
          style={{ fontFamily: 'var(--font-inter)' }}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--error)]" style={{ fontFamily: 'var(--font-inter)' }}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--text-tertiary)]" style={{ fontFamily: 'var(--font-inter)' }}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, type TextareaProps };
