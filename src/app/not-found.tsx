import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Trang không tìm thấy</h2>
        <p className="mt-2 text-muted-foreground">Trang bạn đang tìm kiếm không tồn tại.</p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
