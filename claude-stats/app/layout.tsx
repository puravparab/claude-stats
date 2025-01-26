import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claude Heatmap",
  description: "Get Heatmaps for your Claude AI conversations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
