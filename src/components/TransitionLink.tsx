"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { navigateWithTransition } from "@/lib/viewTransition";

type TransitionLinkProps = ComponentProps<typeof Link>;

/** A next/link that cross-fades via the View Transitions API instead of hard-cutting. */
export function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigateWithTransition(router, href.toString());
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
