import ContactSection from "@/components/home/ContactSection";
import GachaPanelClient from "@/components/contact/GachaPanelClient";

export const metadata = {
  title: "Contact",
  description: "Get in touch for new opportunities and collaborations.",
};

export default function ContactPage() {
  return (
    <>
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ContactSection />
      </main>
      
      {/* Floating Panel for issuing Gacha queries to the WebGL Canvas */}
      <GachaPanelClient />
    </>
  );
}
