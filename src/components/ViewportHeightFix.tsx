"use client";

import { useEffect } from "react";

/**
 * iOS Safari's `100dvh` doesn't reliably track the address bar's
 * show/hide transition right after a client-side navigation, leaving a
 * gap of dead page background between the bottom nav and the browser's
 * own toolbar. Mirror the *real* visible height into a CSS var driven by
 * visualViewport, which Safari keeps accurate live, and prefer it over
 * the dvh unit wherever the app shell needs to fill the screen exactly.
 */
export function ViewportHeightFix() {
  useEffect(() => {
    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${h}px`);
    };
    setVh();
    window.visualViewport?.addEventListener("resize", setVh);
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.visualViewport?.removeEventListener("resize", setVh);
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  return null;
}
