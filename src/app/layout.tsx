// Next
import type { Metadata } from "next";
import { Graduate, Nunito } from "next/font/google";
// Styles
import "@/styles/index.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const graduate = Graduate({ subsets: ["latin"], weight: "400", variable: "--font-graduate" });

export const metadata: Metadata = {
  title: "Minesweeper",
  description: "Minesweeper in the browser: three board sizes, a safe first click, flags and chords.",
  icons: { icon: "/logo/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${graduate.variable}`}>
      <body>{children}</body>
    </html>
  );
}
