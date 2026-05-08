import { useRef } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export function useStableToastRef() {
  const toast = useToast();
  const ref = useRef(toast);
  ref.current = toast;
  return ref;
}
