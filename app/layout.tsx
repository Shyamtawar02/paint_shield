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
  title: "Paint Shield India | India's Trusted Paint Protection Brand",
  description:
  "Paint Shield India is India's Trusted Paint Protection Brand offering Premium PPF, Window Films, and Advanced Car Paint Protection Solutions. Get the best PPF installation and long-lasting vehicle protection.",
 keywords: [
  "Paint Shield",
  "Paint Shield India",
  "Paint Shield PPF",
  "Best PPF",
  "Best PPF Company",
  "Best Paint Protection Film",
  "Best Car Paint Protection",
  "Car PPF",
  "PPF for Cars",
  "Paint Protection Film",
  "PPF India",
  "Premium PPF",
  "Automotive Paint Protection",
  "Car Paint Protection",
  "Ceramic Coating",
  "Ceramic Coating India",
  "PPF Installation",
  "Window Film",
  "Car Detailing",
  "Vehicle Protection",
  "Luxury Car Protection"
],
  openGraph: {
  title: "Paint Shield India | India's Trusted Paint Protection Brand",
  description:
    "Premium Paint Protection Film (PPF), Best Car Paint Protection Solutions, and Professional PPF Installation Services across India.",
  siteName: "Paint Shield India",
},
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