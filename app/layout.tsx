import type { Metadata } from "next";
import { nippo, zodiak } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWOM | Professional Clothing Brand",
  description:
    "TWOM is a Brampton-based professional clothing brand crafting timeless, minimalist pieces for those who move differently.",
  keywords: ["TWOM", "clothing", "Brampton", "professional wear", "minimalist fashion"],
  openGraph: {
    title: "TWOM | Professional Clothing Brand",
    description: "Crafted for the ones who move differently.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nippo.variable} ${zodiak.variable} h-full antialiased`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
