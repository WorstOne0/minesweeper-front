// Next
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
// Components
import Providers from "./providers";
// Styles
import "@/styles/index.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

const DESCRIPTION = "Minesweeper in the browser: three board sizes, a safe first click, flags, chords and your best times.";

export const metadata: Metadata = {
  metadataBase: new URL("https://minesweeper.disboard.dev"),
  title: "Minesweeper",
  description: DESCRIPTION,
  icons: { icon: "/logo/icon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Minesweeper",
    title: "Minesweeper · Three boards, a safe first click, flags and chords",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
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
