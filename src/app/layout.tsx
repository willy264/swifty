import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Space_Grotesk } from "next/font/google";
import { TelegramSessionProvider } from "@/providers";
import { getUser } from "@/lib/api";
import { DEMO_USER_ID } from "@/data/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SwiftyDrop Guard",
  description:
    "Telegram-first airdrop discovery, scam intelligence, wallet safety, task tracking, and gamified crypto security.",
  keywords: [
    "swiftydrop guard",
    "telegram mini app",
    "airdrop security",
    "wallet scanner",
    "crypto tasks",
    "gamified airdrops",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialUser = null;

  try {
    initialUser = await getUser(DEMO_USER_ID);
  } catch {
    initialUser = null;
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-root text-text font-sans">
        <TelegramSessionProvider initialUser={initialUser}>{children}</TelegramSessionProvider>
      </body>
    </html>
  );
}
