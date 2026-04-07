import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/constants";

const thisYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/20">
      <div className="container-wrap py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-black text-primary">{SITE_NAME}</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Global dropshipping marketplace with secure checkout, verified
              inventory, and customer-first support.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Account</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Policies</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          {thisYear} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
