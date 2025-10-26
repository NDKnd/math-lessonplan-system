"use client";

import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/lib/providers/query-provider";
import SidebarNav from "@/components/layout/sidebar-nav";
import { useState } from "react";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// export const metadata: Metadata = {
//   title: "Math Lesson Planning System",
//   description: "Create, manage, and practice math lessons",
//   generator: "v0.app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userRole, setUserRole] = useState<"teacher" | "student">("teacher");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <div className="flex h-screen bg-background">
            <SidebarNav userRole={userRole} setUserRole={setUserRole} />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
