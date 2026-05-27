"use client";

import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginFormView() {
  const { form, loading, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white text-2xl font-bold mb-4 shadow-card">
            VH
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Y Khoa Vạn Hạnh</h1>
          <p className="text-sm text-gray-500 mt-1">Cổng quản trị nội bộ</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Đăng nhập</h2>

          <Input
            label="Email"
            name="email"
            type="text"
            autoComplete="email"
            required
            placeholder="admin@gmail.com"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Mật khẩu"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}
