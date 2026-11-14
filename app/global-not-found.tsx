import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { jetbrains, sora } from "./fonts";
import "./globals.css";

// Each locale has its own root layout, so unmatched URLs render this page instead, in both languages.
export const metadata: Metadata = {
  title: "Page not found · TokHive",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen">
        <main className="site-container flex min-h-screen flex-col items-start justify-center gap-6">
          <LogoMark size={40} />
          <span className="eyebrow">404</span>
          <h1 className="h2">Page not found.</h1>
          <p lang="zh-CN" className="text-xl text-text-2">页面不存在。</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">TokHive home →</Link>
            <Link href="/zh/" lang="zh-CN" className="btn-ghost">返回中文首页</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
