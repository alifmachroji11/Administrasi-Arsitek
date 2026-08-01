import type { useRouter } from "next/navigation";

type AppRouter = ReturnType<typeof useRouter>;

/**
 * Navigates using the browser's View Transitions API when available, so
 * switching between the bottom-nav tabs cross-fades instead of hard-cutting.
 * Falls back to a plain push when unsupported or reduced motion is on.
 */
export function navigateWithTransition(router: AppRouter, href: string) {
  const supportsViewTransition = typeof document !== "undefined" && "startViewTransition" in document;
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (supportsViewTransition && !reduceMotion) {
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
      router.push(href);
    });
  } else {
    router.push(href);
  }
}
