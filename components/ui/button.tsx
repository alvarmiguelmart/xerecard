import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-black transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "action-primary",
  secondary: "action-secondary",
  dark: "action-secondary",
  ghost: "text-ink hover:bg-cloud",
  whatsapp: "action-primary"
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

