import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = `
      inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md 
      text-sm font-medium ring-offset-[var(--background)] transition-colors 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] 
      focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
    `;

    const variants = {
      default: "bg-[var(--primary)] text-[var(--text-inverse)] hover:bg-[var(--primary)]/90",
      destructive: "bg-[var(--error)] text-[var(--text-inverse)] hover:bg-[var(--error)]/90",
      outline: "border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]",
      secondary: "bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]/80",
      ghost: "hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]",
      link: "text-[var(--primary)] underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
