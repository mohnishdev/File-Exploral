import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small";
};

export function Button({
  children,
  className,
  href,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  const classes = cn("button", `button--${variant}`, `button--${size}`, className);
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
