"use client";

import { useRef, useState } from "react";
import { toast } from "@/components/ui/Toast";
import { X, UploadCloud } from "lucide-react";
import { Link } from "@/lib/link";

interface ThumbnailUploadProps {
  value: string;
  onChange: (url: string) => void;
  pendingFile?: File | null;
  onPendingChange?: (file: File | null) => void;
}

export function ThumbnailUpload({
  value,
  onChange,
  pendingFile,
  onPendingChange,
}: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onPendingChange?.(file);
    e.target.value = "";
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onPendingChange?.(null);
    onChange("");
  }

  const displayUrl = preview ?? (value ? Link.imgEndpoid + value : null);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!displayUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors cursor-pointer bg-slate-50/40"
        >
          <UploadCloud className="w-8 h-8" />
          <span className="text-sm font-medium">Chọn ảnh đại diện</span>
          <span className="text-xs text-slate-300">PNG, JPG, WEBP (tối đa 5MB)</span>
        </button>
      ) : (
        <div className="relative w-full h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="thumbnail"
            className="w-full h-full object-cover rounded-xl border border-slate-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity shadow-sm"
            title="Xóa ảnh"
          >
            <X size={14} />
          </button>
          {pendingFile && (
            <span className="absolute bottom-2 left-2 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded">
              Chưa upload
            </span>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white/90 text-slate-600 text-xs px-2 py-1 rounded-lg border border-slate-200 hover:bg-white transition-colors shadow-sm"
          >
            Thay đổi
          </button>
        </div>
      )}
    </div>
  );
}
