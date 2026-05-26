/**
 * Spinner – loading indicator dựa trên shadcn pattern (Loader2 icon từ lucide).
 * Giữ nguyên API: Spinner, LoadingPage, LoadingSpinner
 */
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const sizeClasses = {
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
};

export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Loader2
      className={cn("animate-spin text-primary-600", sizeClasses[size], className)}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="lg" />
    </div>
  );
}

export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Spinner size="md" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
