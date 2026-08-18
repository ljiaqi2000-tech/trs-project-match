import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "大学生AI×大数据项目匹配测评",
  description: "2分钟匹配最适合你的企业项目实训，并获得个性化成长路径。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
