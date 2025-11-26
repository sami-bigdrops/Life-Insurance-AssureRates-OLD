import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Life Insurance Form | AssureRates",
  description: "Life insurance form for using AssureRates's insurance comparison services.",
};

export default function FpsFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
