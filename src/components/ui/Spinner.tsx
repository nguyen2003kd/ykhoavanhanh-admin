/**
 * Spinner – loading indicator đồng nhất cho toàn bộ app.
 * Variants: Spinner, LoadingPage, LoadingSection, LoadingOverlay, PageSkeleton
 */
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
  xl: "size-16",
};

export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
}

/** Full-screen loading (auth check, initial load) */
export function LoadingPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background">
      <div className="relative">
        <Spinner size="xl" />
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Đang tải…
      </p>
    </div>
  );
}

/** Inline section loading (table, card content) */
export function LoadingSection({ text = "Đang tải dữ liệu…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/** Overlay loading (form submit, modal action) */
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" />
      {text && <p className="text-sm font-medium text-muted-foreground">{text}</p>}
    </div>
  );
}

/** Skeleton placeholder for table rows */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
          <div className="h-10 w-10 rounded-xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
          <div className="h-8 w-20 rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

/** Legacy compat – đồng nhất với LoadingSection */
export function LoadingSpinner({ text }: { text?: string }) {
  return <LoadingSection text={text} />;
}
