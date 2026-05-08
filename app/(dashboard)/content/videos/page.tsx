"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockVideos } from "@/mock-data/content";
import { Play, Plus } from "lucide-react";

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video</h1>
          <p className="text-sm text-gray-500 mt-1">Video hướng dẫn và tư vấn sức khỏe</p>
        </div>
        <Link href="/content/videos/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Thêm video</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockVideos.map((v) => (
          <Card key={v.id} className="overflow-hidden">
            <div className="h-36 bg-gray-100 flex items-center justify-center relative">
              <Play className="h-10 w-10 text-gray-400" />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{v.title}</h3>
                <Badge variant={v.isPublished ? "success" : "default"} className="shrink-0">{v.isPublished ? "Đăng" : "Ẩn"}</Badge>
              </div>
              <p className="text-xs text-gray-500">{v.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span>{v.viewCount?.toLocaleString()} lượt xem</span>
                <span className="capitalize">{v.platform}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
