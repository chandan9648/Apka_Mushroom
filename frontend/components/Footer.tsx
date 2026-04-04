import Link from "next/link";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "My Account", href: "/account" },
  ],
  company: [
    { label: "Home", href: "/" },
    { label: "Contacts", href: "/#contacts" },
    { label: "About Us", href: "/#about-us" },

    // { label: "Recipes", href: "/#recipes" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400">
      {/* Main footer body */}
      <div className="container-x pt-14 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="no-underline inline-flex items-center gap-3 group">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-zinc-900 text-sm font-bold shrink-0 shadow-sm">
                AM
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">RB Organic Mushroom</div>
                <div className="text-xs text-zinc-500">kingdom of health</div>
              </div>
            </Link>

            <p className="mt-5 text-sm text-zinc-500 leading-relaxed">
              Bringing nature&apos;s finest fungi directly to your doorstep. Organic, premium quality, and
              sustainably sourced mushroom products for a healthier life.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-700 text-zinc-400 hover:border-amber-400 hover:text-amber-400 transition-colors no-underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-700 text-zinc-400 hover:border-amber-400 hover:text-amber-400 transition-colors no-underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-700 text-zinc-400 hover:border-amber-400 hover:text-amber-400 transition-colors no-underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <div className="text-sm font-semibold text-white mb-4">Shop</div>
            <ul className="grid gap-2.5 text-sm">
              {footerLinks.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-500 hover:text-white no-underline transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <div className="text-sm font-semibold text-white mb-4">Company</div>
            <ul className="grid gap-2.5 text-sm">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-500 hover:text-white no-underline transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Why choose us */}
          <div>
            <div className="text-sm font-semibold text-white mb-4">Why Choose Us</div>
            <ul className="grid gap-3 text-sm">
              {[
                "100% Organic & Natural",
                "Lab Tested & Certified",
                "Free Shipping Above ₹499",
                "Premium Quality Guarantee",
                "Fast & Reliable Delivery",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-zinc-500">
                  <span className="mt-0.5 shrink-0 text-amber-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider & bottom bar */}
        <div className="mt-12 border-t border-zinc-800 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-600">
            © {new Date().getFullYear()} RBorganicMushroom. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Refund Policy", href: "#" },
              { label: "Shipping Policy", href: "#" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="no-underline text-zinc-600 hover:text-zinc-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
