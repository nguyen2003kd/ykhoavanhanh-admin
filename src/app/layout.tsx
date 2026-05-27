"use client";

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Y Khoa Vạn Hạnh - Admin Portal",
//   description: "Hệ thống quản lý bệnh viện Y Khoa Vạn Hạnh",
//   icons: {
//     icon: "/logo/vh-icon.svg",
//     apple: "/logo/vh-icon.svg",
//     shortcut: "/logo/logo-mobile.png",
//   },
// };

function ToasterProvider() {
  return <Toaster position="top-right" richColors closeButton />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <ToasterProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
