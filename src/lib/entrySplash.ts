const KEY = "notula-entry-splash";

/** Call right before navigating into the app after a successful login/register. */
export function markEntrySplash() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // sessionStorage unavailable (private mode, etc.) — splash just won't show.
  }
}

/** Call once on mount of the post-auth destination screen. Returns true at most once per navigation. */
export function consumeEntrySplash(): boolean {
  try {
    if (sessionStorage.getItem(KEY) === "1") {
      sessionStorage.removeItem(KEY);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}
