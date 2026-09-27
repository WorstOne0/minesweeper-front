// Next
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
// Components
import Providers from "./providers";
// Styles
import "@/styles/index.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Minesweeper",
  description: "Minesweeper in the browser: three board sizes, a safe first click, flags, chords and your best times.",
  icons: { icon: "/logo/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
