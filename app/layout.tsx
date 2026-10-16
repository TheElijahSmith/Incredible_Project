import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taste and See | Harding’s Unfiltered Dining Reviews",
  description: "An independent Harding University dining community: food reviews, live chat, and what to try next.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
