import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Y Khoa Vạn Hạnh - Admin Portal",
  description: "Hệ thống quản lý bệnh viện Y Khoa Vạn Hạnh",
  icons: {
    icon: "/logo/vh-icon.svg",
    apple: "/logo/vh-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
