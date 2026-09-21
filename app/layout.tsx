import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TWOM | PROFESSIONAL CLOTHING BRAND",
  description: "Mobile luxury clothing brand store",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-950 text-neutral-100 flex justify-center m-0">
        <div className=" w-full max-w-md bg-black min-h-screen shadow-2xl border-x border-neutral-800 flex flex-col relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
