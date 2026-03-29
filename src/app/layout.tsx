import type { Metadata } from "next";
import Nav from "@/components/ui/Nav";
import "@/styles/globals.css";

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
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
