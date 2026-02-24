import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-offset-2 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900/10 ${className}`}
      {...props}
    />
  );
}
