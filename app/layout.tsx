import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
const nippo = localFont({
  src: "./fonts/nippo/Nippo-Variable.woff2",
  variable: "--font-nippo",
  display: "swap",
});

const zodiak = localFont({
  src: [
    {
      path: "./fonts/zodiak/Zodiak-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/zodiak/Zodiak-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-zodiak",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TWOM | Luxury Minimalist Apparel",
  description: "Designed for working professionals. The art of restraint.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${zodiak.variable} ${nippo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-twom-bg text-twom-body">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
