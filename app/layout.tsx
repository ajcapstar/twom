import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import QuickBuySheet from "../components/QuickBuySheet";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("h-full", "antialiased", zodiak.variable, nippo.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-twom-bg text-twom-body">
        <Navbar />
        <CartDrawer />
        <QuickBuySheet />
        {children}
        <Footer />
      </body>
    </html>
  );
}
