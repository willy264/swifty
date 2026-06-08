"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";

export function ActionButton({
  href,
  children,
  external = false,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <ExternalLink size={14} />
      </a>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => {
          router.push(href);
        });
      }}
      disabled={isPending}
      className={`${className} ${isPending ? "opacity-75 cursor-not-allowed" : ""}`}
    >
      {isPending ? <LoaderCircle size={14} className="animate-spin mr-1" /> : null}
      {children}
    </button>
  );
}

export function RefreshButton({
  href,
  label = "TRY AGAIN",
}: {
  href: string;
  label?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          // Force a hard refresh of the server component data if the route is the same
          window.location.href = href;
        });
      }}
      disabled={isPending}
      className={`btn-secondary ${isPending ? "opacity-75 cursor-not-allowed" : ""}`}
    >
      <span className="inline-flex items-center gap-2">
        {isPending ? (
          <LoaderCircle size={14} className="animate-spin" />
        ) : (
          <RefreshCw size={14} />
        )}
        {isPending ? "SYNCHRONIZING..." : label}
      </span>
    </button>
  );
}
