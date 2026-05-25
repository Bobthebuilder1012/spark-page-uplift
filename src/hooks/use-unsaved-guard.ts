import { useEffect } from "react";

/**
 * Warns the user before leaving the page when there are unsaved changes.
 * Uses the standard browser `beforeunload` prompt — works for tab close,
 * refresh, and external navigation. In-app navigation can additionally be
 * guarded at the component level.
 */
export function useUnsavedGuard(dirty: boolean, message = "You have unsaved changes. Leave anyway?") {
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, message]);
}
