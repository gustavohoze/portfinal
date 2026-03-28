"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

interface TransitionLinkProps extends ComponentProps<typeof Link> {
  href: string;
}

export default function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Determine the absolute URL to check against the current pathname
    const targetUrl = new URL(href, window.location.href);

    // If it's a hash link on the EXACT same page, don't trigger the massive black overlay. Let it scroll.
    if (targetUrl.pathname === pathname && targetUrl.hash) return;
    
    // If it's pointing to the exact same page without a hash, do nothing.
    if (targetUrl.pathname === pathname && !targetUrl.hash) {
      e.preventDefault();
      return;
    }

    // Intercept Next.js instant routing
    e.preventDefault();

    // Command the global PageTransition container to start closing the Iris
    window.dispatchEvent(
      new CustomEvent("page-transition", {
        detail: { href, x: e.clientX, y: e.clientY },
      })
    );
  };

  return (
    <Link href={href} onClick={handleClick} scroll={false} {...props}>
      {children}
    </Link>
  );
}
