import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import GA from "@/components/GA";

export const metadata = { title: "Electric Car Trader Australia", description: "EV marketplace for Australia." };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><body>
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">Electric Car Trader</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/vehicles">Browse</Link>
            <Link href="/sell">Sell</Link>
            <Link href="/dealer">Dealer</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="border-t mt-10"><div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">© {new Date().getFullYear()} Electric Car Trader Australia</div></footer>
      <GA />
    </body></html>
  );
}
