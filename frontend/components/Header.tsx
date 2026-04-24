"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";

function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors no-underline after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-amber-500 after:transition-all after:duration-300 hover:after:w-full ${active
        ? "text-zinc-900 after:w-full after:bg-amber-500"
        : "text-zinc-600 hover:text-zinc-900"
        } ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}

function IconBtn({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <span
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full text-zinc-700 hover:bg-black/6 hover:text-zinc-900 transition-colors"
    >
      {children}
    </span>
  );
}
//search icon
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35M10.8 18.6a7.8 7.8 0 1 1 0-15.6 7.8 7.8 0 0 1 0 15.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

//user icon
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


//favorite icon
function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

//menu icon
function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

//close icon
function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useFavorites();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 border-b border-zinc-200 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-none"}`}>
      {/* Announcement banner */}
      <div className="bg-zinc-900 text-white">
        <div className="container-x py-2 text-center text-xs font-medium tracking-wide">
          <span className="text-amber-400">✦</span>
          {" "}Enjoy · 100% Organic &amp; Lab Tested Mushroom{" "}
          <span className="text-amber-400">✦</span>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="glass">
        <div className="container-x flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="no-underline shrink-0">
            <div className="flex items-center gap-3">
              {/* <div className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-zinc-900 text-sm font-bold shadow-sm">
                RB
              </div> */}
              <div className="leading-tight">
                {/* <div className="text-sm font-bold tracking-tight text-zinc-900">RB Organic Mushroom</div>
                <div className="text-xs text-zinc-500">kingdom of health</div> */}
                <div>
                  <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900 ">
                    <img src="/logoimg.jpg" alt="RB Organic Mushroom" width={110} height={100} className="rounded-full hover:scale-105 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="/">Home</NavLink>
            {user?.role !== "admin" ? (
              <Link
                href="/products"
                className="relative text-sm font-medium text-zinc-600 hover:text-zinc-900 no-underline inline-flex items-center gap-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-amber-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                Products
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : null}
            <NavLink href="/#">Contact</NavLink>
  
            <NavLink href="/#about">Abouts</NavLink>
            {user?.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
          </nav>

          {/* Icon actions */}
          <div className="flex items-center gap-0.5">
            <Link href="/products" className="no-underline" aria-label="Search">
              <IconBtn><IconSearch /></IconBtn>
            </Link>

            <Link href={user ? "/account" : "/auth/login"} className="no-underline" aria-label="Account">
              <IconBtn><IconUser /></IconBtn>
            </Link>


            {user?.role !== "admin" ? (
              <Link href="/favorites" className="no-underline relative" aria-label="Favorites">
                <IconBtn><IconHeart /></IconBtn>
                {count > 0 ? (
                  <span className="absolute right-0 top-0 grid h-5 w-5 -translate-y-0.5 translate-x-0.5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm transition-transform duration-300 animate-pulse-soft">
                    {count}
                  </span>
                ) : null}
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <IconBtn>{mobileOpen ? <IconClose /> : <IconMenu />}</IconBtn>
            </button>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="ml-2 hidden md:inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 transition-colors cursor-pointer"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="ml-2 hidden md:inline-flex no-underline rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Log in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen ? (
          <div id="mobile-menu" className="border-t border-amber-200 md:hidden bg-amber-50">
            <div className="container-x py-4">
              <nav className="flex flex-col gap-1">
                {[
                  { href: "/", label: "Home" },
                  ...(user?.role !== "admin" ? [{ href: "/products", label: "Products" }] : []),

                  { href: "/#contact", label: "Contact" },
                  // { href: "/#recipes", label: "Recipes" },
                  { href: "/#media", label: "Abouts" },

                  ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-amber-100 hover:text-zinc-900 no-underline transition-colors "
                  >
                    {l.label}
                  </Link>
                ))}

                <div className="mt-3 pt-3 border-t border-amber-200">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-left text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer hover:bg-zinc-400"
                    >
                      Log out
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white no-underline text-center cursor-pointer"
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
