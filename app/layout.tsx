import type { Metadata } from "next";
import { nippo, zodiak } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWOM | PROFESSIONAL CLOTHING BRAND",
  description: "Mobile luxury clothing brand store",
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
        {/* <body className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center m-0"> */}
        {/* <div className=" w-full max-w-md bg-black min-h-screen shadow-2xl border-x border-neutral-800 flex flex-col relative overflow-x-hidden"> */}
        <div>{children}</div>
      </body>
    </html>
  );
}
