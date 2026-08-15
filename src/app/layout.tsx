import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Meridian — Arizona classroom needs, mapped",
  description:
    "See exactly what Arizona classrooms still need, help from where you live, and read the education bills that shape those classrooms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
