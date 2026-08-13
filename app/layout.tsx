import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "ORBITAL | オーラ適性診断", description: "あなたの性格から、まだ知らない能力を見つける。" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
