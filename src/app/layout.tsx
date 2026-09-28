
import { Inter } from "next/font/google"; 
import "./globals.css";
import { Metadata } from 'next'

import Footer from "./components/footer";
import Navbar from "./components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// app/layout.tsx
export const metadata: Metadata = {
  title: "Bluemoon Restaurant",
  description: "Fine dining at its best.",
  icons: {
    icon: "/favicon.ico", // You will update this file below
  },
  keywords: [
    "Bluemoon",
    "Bluemoon Restaurant",
    "bluemoonrestaurants",
    "Bluemoon restaurant Australia",
    "4 Station Street, Wentworthville NSW 2145, Sydney, Australia",
    "32-36 Burlington Rd, Homebush NSW 2140 ,Sydney,  Australia",
    "114 Pendle Way, Pendle Hill NSW 2145 ,Sydney,  Australia",
    "Bluemoon restaurant Sydney",
    "Bluemoon restaurant menu",
    "Bluemoon Restaurant Sydney",
    "Bluemoon Restaurant Australia",
    "Bluemoon Mallu Restaurant Sydney",
    "Bluemoon Mallu Restaurant Australia",
    "Bluemoon Kerala Restaurant Sydney",
    "Bluemoon Kerala Restaurant Australia",
    "Bluemoon Restaurant pendle hill",
    "Bluemoon Restaurant Homebush",
    "Kerala Restaurant Australia",
    "Kerala food near me",
    "best Kerala food in Australia",
    "Kerala restaurant in Sydney",
    "authentic Kerala food Australia",
    "Kerala cuisine Sydney",
    "Indian restaurant Australia",
    "best Indian cuisine",
    "authentic Indian food",
    "Indian food near me",
    "South Indian food Australia",
    "top rated Kerala restaurant",
    "best kerala cuisine in Sydney",
    "best kerala cuisine in Australia",
    "restaurant booking",
    "Bluemoon restaurant reviews",
    "traditional Kerala meals Australia",
    "Kerala takeaway Sydney",
    "Kerala lunch and dinner specials"
  ],
  
  openGraph: {
    title: "Bluemoon Restaurant",
    description: "Authentic Indian Cuisine in Australia – Dine in or order online.",
    url: "https://bluemoonrestaurants.com",
    siteName: "Bluemoon Restaurant",
    locale: "en_US",
    type: "website",
  },
  authors: [{ name: "Bluemoon Restaurant" }],
  creator: "Bluemoon Restaurant",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
<head>
  <link rel="icon" href="/LOGO.jpg" type="image/jpg" />
  <title>Bluemoon Restaurant</title>
  {/* ✅ Structured Data for Logo */}
  <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Bluemoon Restaurant",
            "url": "https://bluemoonrestaurants.com",
            "logo": "https://bluemoonrestaurants.com/LOGO.jpg"
          })
        }} />
</head>

      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
