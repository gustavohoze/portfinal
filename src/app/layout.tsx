import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/ui/ClientProviders";
import CustomCursor from "@/components/ui/CustomCursor";
import PageTransition from "@/components/ui/PageTransition";
import GlobalCanvasWrapper from "@/components/ui/GlobalCanvasWrapper";
import "./globals.css";

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    template: "%s — Portfolio",
    default: "Portfolio",
  },
  description: "Designer & developer crafting thoughtful digital products.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Portfolio",
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <PageTransition />
          <CustomCursor />
          
          {/* Global persistent 3D background */}
          <div className="canvas-wrapper">
            <GlobalCanvasWrapper />
          </div>

          <Header />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
