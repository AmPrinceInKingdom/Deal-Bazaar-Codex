import Link from "next/link";
import { Menu } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { getAuthContext } from "@/lib/auth";
import { SearchForm } from "@/components/layout/search-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NavActions } from "@/components/layout/nav-actions";

export async function Navbar() {
  const auth = await getAuthContext();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="container-wrap py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black tracking-tight text-primary">
              {SITE_NAME}
            </Link>
            <nav className="hidden items-center gap-4 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden w-full max-w-xl md:block">
            <SearchForm />
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NavActions
              isAuthenticated={Boolean(auth)}
              isAdmin={auth?.profile?.role === "admin"}
              userName={auth?.profile?.full_name}
            />
            <details className="relative lg:hidden">
              <summary className="list-none rounded-full p-2 hover:bg-muted">
                <Menu className="h-5 w-5" />
              </summary>
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-3 shadow-lg">
                <div className="mb-3 md:hidden">
                  <SearchForm />
                </div>
                <div className="grid gap-2">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
