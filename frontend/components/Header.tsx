"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";

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
      className={`text-sm font-medium ${active ? "text-zinc-900" : "text-zinc-700 hover:text-zinc-900"} no-underline ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full text-zinc-900 hover:bg-black/5">{children}</span>
  );
}

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

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-4.35-9.5-8.6C.9 9.6 2.2 6.7 5.2 5.6c2-.7 4.1.1 5.3 1.7 1.2-1.6 3.3-2.4 5.3-1.7 3 1.1 4.3 4 2.7 6.8C19 16.65 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15l-2 10H7L6 7Zm0 0-.8-3H2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200">
      <div className="bg-zinc-900  text-white">
        <div className="container-x py-2 text-center text-xs font-medium">
          Dear Customers, to place your order, make your day better with Apka Mushroom!
        </div>
      </div>

      <div className="bg-amber-50">
        <div className="container-x flex h-20 items-center justify-between gap-4">
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white text-sm font-semibold">AM</div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">Apka Mushroom</div>
                <div className="text-xs text-zinc-600">kingdom of health</div>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="/">Home</NavLink>
            <Link href="/products" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 no-underline inline-flex items-center gap-1">
              Shop
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <NavLink href="/#our-story">Our Story</NavLink>
            <NavLink href="/#blogs">Blogs</NavLink>
            <NavLink href="/#media">Media</NavLink>
            <NavLink href="/#recipes">Recipes</NavLink>
            {user?.role === "admin" ? <NavLink href="/admin">Admin</NavLink> : null}
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/products" className="no-underline" aria-label="Search">
              <Icon>
                <IconSearch />
              </Icon>
            </Link>

            <Link href={user ? "/account" : "/auth/login"} className="no-underline" aria-label="Account">
              <Icon>
                <IconUser />
              </Icon>
            </Link>

            <Link href="/account" className="no-underline" aria-label="Favorites">
              <Icon>
                <IconHeart />
              </Icon>
            </Link>

            <Link href="/cart" className="no-underline relative" aria-label="Cart">
              <Icon>
                <IconCart />
              </Icon>
              {count > 0 ? (
                <span className="absolute right-0 top-0 grid h-5 w-5 -translate-y-1 translate-x-1 place-items-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white">
                  {count}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full text-zinc-900 hover:bg-black/5">
                {mobileOpen ? <IconClose /> : <IconMenu />}
              </span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="ml-2 hidden rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 md:inline-flex"
              >
                Log out
              </button>
            ) : null}
          </div>
        </div>

        {mobileOpen ? (
          <div id="mobile-menu" className="border-t border-black/5 md:hidden">
            <div className="container-x py-3">
              <nav className="flex flex-col">
                <NavLink href="/" className="block py-2" onClick={() => setMobileOpen(false)}>
                  Home
                </NavLink>
                <NavLink href="/products" className="block py-2" onClick={() => setMobileOpen(false)}>
                  Shop
                </NavLink>
                <NavLink href="/#our-story" className="block py-2" onClick={() => setMobileOpen(false)}>
                  Our Story
                </NavLink>
                <NavLink href="/#blogs" className="block py-2" onClick={() => setMobileOpen(false)}>
                  Blogs
                </NavLink>
                <NavLink href="/#media" className="block py-2" onClick={() => setMobileOpen(false)}>
                  Media
                </NavLink>
                <NavLink href="/#recipes" className="block py-2" onClick={() => setMobileOpen(false)}>
                  Recipes
                </NavLink>
                {user?.role === "admin" ? (
                  <NavLink href="/admin" className="block py-2" onClick={() => setMobileOpen(false)}>
                    Admin
                  </NavLink>
                ) : null}

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="mt-2 inline-flex w-fit rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    Log out
                  </button>
                ) : null}
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
