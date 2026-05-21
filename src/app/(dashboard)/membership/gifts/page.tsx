"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockGifts } from "@/mock-data/membership";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function GiftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh mục quà tặng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý quà đổi điểm thành viên</p>
        </div>
        <Link href="/membership/gifts/new">
          <Button variant="primary"><Plus className="h-4 w-4 mr-2" />Thêm quà</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockGifts.map((gift) => (
          <Card key={gift.id} className="overflow-hidden">
            {gift.imageUrl && (
              <div className="h-32 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Hình ảnh quà</span>
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{gift.name}</h3>
                <Badge variant={gift.isActive ? "success" : "default"}>{gift.isActive ? "Có" : "Tắt"}</Badge>
              </div>
              <p className="text-sm text-gray-500">{gift.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-primary-700 font-bold">{gift.pointsRequired.toLocaleString()} điểm</span>
                <span className="text-sm text-gray-500">Còn: {gift.stock}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
