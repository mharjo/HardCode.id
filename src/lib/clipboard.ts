/**
 * Copies text to the clipboard, preferring the async Clipboard API and
 * falling back to the legacy `document.execCommand("copy")` trick (via a
 * temporary off-screen textarea) for browsers/contexts where
 * `navigator.clipboard` is unavailable (e.g. non-secure contexts). Mirrors
 * SOURCE's `copyCodeSnippet`/`shareArticle` fallback behavior.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy fallback below.
    }
  }

  if (typeof document === "undefined") return false;

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}
