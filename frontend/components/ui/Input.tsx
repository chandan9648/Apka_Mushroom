import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-offset-1 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors ${className}`}
      {...props}
    />
  );
}
