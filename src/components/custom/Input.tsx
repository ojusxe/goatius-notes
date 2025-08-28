import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const [inputId, setInputId] = React.useState(id);

    React.useEffect(() => {
      if (!id) {
        setInputId(`input-${Math.random().toString(36).substr(2, 9)}`);
      }
    }, [id]);

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-body"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            `
              w-full px-4 py-3 rounded-lg border 
              bg-[var(--surface)] text-[var(--text-primary)] font-body
              placeholder:text-[var(--text-tertiary)]
              transition-smooth
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
            `,
            error 
              ? 'border-[var(--error)] focus:ring-[var(--error)]' 
              : 'border-[var(--border)] focus:ring-[var(--primary)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[var(--error)] font-body">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-[var(--text-tertiary)] font-body">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps };
