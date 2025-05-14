
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

export function toast({
  title,
  description,
  variant = "default",
  duration = 3000,
}: ToastProps) {
  const variantMap = {
    default: sonnerToast,
    destructive: sonnerToast.error,
    success: sonnerToast.success,
  };

  const toastFn = variantMap[variant] || sonnerToast;
  
  toastFn(title, {
    description,
    duration,
  });
}

export const useToast = () => {
  return { toast };
};
