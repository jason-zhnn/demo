import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shelf",
  description: "Personal reading tracker",
};

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/library", label: "Library" },
  { href: "/authors", label: "Authors" },
  { href: "/shelves", label: "Shelves" },
  { href: "/tags", label: "Tags" },
  { href: "/notes", label: "Notes" },
  { href: "/sessions", label: "Sessions" },
  { href: "/stats", label: "Stats" },
  { href: "/goals", label: "Goals" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              Shelf
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-neutral-600">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-neutral-900">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
