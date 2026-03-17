import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WeatherAI - Next-Gen Weather Platform",
  description: "Production-ready SaaS weather platform with AI summaries, interactive maps, and live radar.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen text-white bg-night bg-fixed bg-cover selection:bg-blue-500/30`} suppressHydrationWarning>
        <Providers>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow w-full pb-8">
              {children}
            </main>
            <footer className="w-full text-center py-6 mt-auto text-white/50 text-sm">
              <p>&copy; 2026 WeatherAI Platform. Built for the future.</p>
              <p>Made by Shailesh Pathak.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
