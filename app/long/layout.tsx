import type { Metadata } from "next";
import Navbar from "@/app/components/sections/Navbar";
import Footer from "@/app/components/sections/Footer";

export const metadata: Metadata = {
  title: "Life Insurance - AssureRates",
  description: "AssureRates offers affordable and reliable life insurance solutions tailored for individuals and families in the USA. Compare top-rated policies, get instant quotes, and secure your future with trusted coverage and expert guidance. Protect what matters most today with AssureRates's industry-leading insurance services.",
};

export default function FpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-auto">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

