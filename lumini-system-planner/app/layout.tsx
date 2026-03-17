import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUMINI System Planner",
  description: "Professional low-voltage outdoor lighting planner for trade partners."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
