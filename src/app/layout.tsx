import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-100 text-neutral-900">
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-lg font-semibold tracking-tight">MMM</h1>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-black/80">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-black/80">
                Dashboard
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}