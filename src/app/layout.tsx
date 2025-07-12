import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], 
});

export const metadata: Metadata = {
  title: "FitFlow AI",
  description: "Transform your fitness journey with AI-powered personalized training and nutrition plans.",
  icons: {
    icon: "hero-ai2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
           <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#C0C9EE",
              color: "#090040",
            },
          }}
        />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}