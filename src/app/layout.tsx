import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import HeroCanvas from "@/components/ui/HeroCanvas";
import SmoothScroll from "@/components/ui/SmoothScroll";
import "@/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const BASE_URL = "https://adriacompte.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Adrià Compte | Senior Product Designer & Creative Coder",
    template: "%s | Adrià Compte",
  },
  description:
    "Adrià Compte — Senior Product Designer, creative coder and entrepreneur based in Barcelona. Crafting design systems, AI-driven workflows, and digital products people love.",
  keywords: [
    "Adrià Compte",
    "Adria Compte",
    "Product Designer",
    "Design Systems",
    "Creative Coder",
    "Barcelona",
    "UX Design",
    "UI Design",
  ],
  authors: [{ name: "Adrià Compte", url: BASE_URL }],
  creator: "Adrià Compte",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Adrià Compte",
    title: "Adrià Compte | Senior Product Designer & Creative Coder",
    description:
      "Crafting design systems, AI-driven workflows, and digital products people love. Based in Barcelona.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrià Compte | Senior Product Designer & Creative Coder",
    description:
      "Crafting design systems, AI-driven workflows, and digital products people love. Based in Barcelona.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Adrià Compte",
              url: "https://adriacompte.com",
              jobTitle: "Senior Product Designer",
              description:
                "Senior Product Designer, creative coder and entrepreneur based in Barcelona.",
              sameAs: [
                "https://www.linkedin.com/in/adria-compte-product-designer/",
                "https://www.instagram.com/adria_compte/",
                "https://github.com/muniatu",
              ],
              knowsAbout: [
                "Product Design",
                "Design Systems",
                "UX Engineering",
                "Creative Coding",
                "AI-driven Design Workflows",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Barcelona",
                addressCountry: "ES",
              },
            }),
          }}
        />
      </head>
      <body>
        <SmoothScroll />
        <HeroCanvas />
        <Nav />
        <div className="relative">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
