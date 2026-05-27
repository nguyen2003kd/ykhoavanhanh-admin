import { create } from "zustand";
import { toast } from "sonner";

// Toast store for global notifications
interface ToastState {
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: Error) => string);
    }
  ) => Promise<T>;
}

export const useToastStore = (): ToastState => ({
  success: (message, description) => toast.success(message, { description }),
  error: (message, description) => toast.error(message, { description }),
  info: (message, description) => toast(message, { description }),
  warning: (message, description) => toast.warning(message, { description }),
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: Error) => string);
    }
  ) => {
    // toast.promise shows loading/success/error UI but doesn't return the promise
    toast.promise(promise, messages);
    return promise; // Return the original promise for chaining
  },
});

// Hook for easy use
export const useToast = () => {
  const state = useToastStore();
  return state;
};
