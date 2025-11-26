import type { Metadata } from "next";
import Navbar from "@/app/components/sections/Navbar";
import Footer from "@/app/components/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | AssureRates",
  description: "Privacy policy for using AssureRates's insurance comparison services.",
};

export default function PrivacyPolicyLayout({
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
