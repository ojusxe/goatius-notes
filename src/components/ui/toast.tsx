// Simple toast placeholder - we'll focus on SSR, so removing complex toast functionality
export const Toast = () => null;
export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const ToastViewport = () => null;
export const ToastClose = () => null;
export const ToastTitle = () => null;
export const ToastDescription = () => null;
export const ToastAction = () => null;

export type ToastProps = {
  variant?: "success" | "destructive" | "default";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export type ToastActionElement = React.ReactElement;
