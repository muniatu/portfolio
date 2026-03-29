import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Nav from "@/components/ui/Nav";
import "@/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Adria Compte | Designer & Creative Coder",
    template: "%s | Adria Compte",
  },
  description:
    "Portfolio of Adria Compte - Product Designer, Creative Coder & Photographer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
