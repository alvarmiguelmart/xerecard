import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-black transition disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-acid text-ink shadow-[0_10px_22px_rgba(0,225,11,0.22)] hover:bg-mint",
  secondary: "border border-ink/12 bg-white text-ink hover:border-ink/25 hover:bg-cloud",
  dark: "bg-ink text-white shadow-[0_10px_22px_rgba(7,16,20,0.16)] hover:bg-panel",
  ghost: "text-ink hover:bg-ink/5",
  whatsapp: "bg-[#25d366] text-ink shadow-[0_10px_22px_rgba(37,211,102,0.22)] hover:bg-[#20bd5a]"
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-3.5 text-sm",
  md: "min-h-12 px-5 text-sm",
  lg: "min-h-14 px-6 text-base"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

export function ButtonLink({
  className,
  href,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {icon}
    </Link>
  );
}
