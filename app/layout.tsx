import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

// Fonts setup
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Yahan SEO Metadata update kar diya hai
export const metadata: Metadata = {
  title: "Paint Shield India | Elite Detailing",
  description: "Premium Paint Protection Film (PPF), Ceramic Coating, and Automotive Perfection.",
  keywords: ["Paint Shield India", "Paint Protection Film", "PPF India", "Ceramic Coating", "Car Detailing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}