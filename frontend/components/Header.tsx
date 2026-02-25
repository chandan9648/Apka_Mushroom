"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm ${active ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"} no-underline`}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="no-underline">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900 text-white text-sm font-semibold">AM</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Apka Mushroom</div>
              <div className="text-xs text-zinc-500">mushroom store</div>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/cart">Cart ({count})</NavLink>
          <NavLink href="/account">Account</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-sm text-zinc-600 sm:block">Hi, {user.name.split(" ")[0]}</div>
              <Button variant="secondary" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="no-underline">
                <Button variant="secondary">Log in</Button>
              </Link>
              <Link href="/auth/signup" className="no-underline hidden sm:block">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-200 md:hidden">
        <div className="container-x flex h-12 items-center justify-between">
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/cart">Cart ({count})</NavLink>
          <NavLink href="/account">Account</NavLink>
        </div>
      </div>
    </header>
  );
}
