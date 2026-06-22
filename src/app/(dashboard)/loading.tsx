import { LoadingSection } from "@/components/ui/Spinner";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSection text="Đang tải trang…" />
    </div>
  );
}
