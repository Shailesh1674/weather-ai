"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { CloudRain } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full glass-panel flex justify-between items-center p-4 my-4 sticky top-4 z-50 transition-all duration-300">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <CloudRain className="w-8 h-8 text-blue-300" />
        <span>WeatherAI</span>
      </Link>
      
      <div className="flex gap-4 items-center">
        {session ? (
          <>
            <span className="hidden sm:inline-block font-medium">Hi, {session.user?.name}</span>
            <button 
              onClick={() => signOut()}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition shadow-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button 
            onClick={() => signIn()}
            className="px-4 py-2 rounded-full bg-blue-500/80 hover:bg-blue-600 transition shadow-sm font-medium"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
