import Navbar from "@/app/components/sections/Navbar";
import Footer from "@/app/components/sections/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | AssureRates",
  description: "Terms and conditions for using AssureRates's insurance comparison services.",
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-auto">
      <Navbar/>
      {children}
      <Footer />
    </div>
  );
}
