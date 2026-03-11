import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "accent";
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-700 shadow-sm",
    secondary: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm",
    ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
    accent: "bg-amber-400 text-zinc-900 hover:bg-amber-300 shadow-sm font-semibold",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
