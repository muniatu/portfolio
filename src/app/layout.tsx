import type { Metadata } from "next";
import { Lato, PT_Serif } from "next/font/google";
import Nav from "@/components/ui/Nav";
import "@/styles/globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
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
    <html lang="en" className={`${lato.variable} ${ptSerif.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
