import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
    ghost: "text-zinc-900 hover:bg-zinc-100",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
