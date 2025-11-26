import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Insurance AssureRates",
  description: "AssureRates offers affordable and reliable life insurance solutions tailored for individuals and families in the USA. Compare top-rated policies, get instant quotes, and secure your future with trusted coverage and expert guidance. Protect what matters most today with AssureRates's industry-leading insurance services.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
