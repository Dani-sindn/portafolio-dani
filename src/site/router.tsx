import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";

// Tiny History-API router: the site only has "/", "/lab" and "/lab/:slug".

const EVENT = "dc:navigate";

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  const [path, hash] = to.split("#");
  window.history.pushState(null, "", to);
  window.dispatchEvent(new Event(EVENT));
  requestAnimationFrame(() => {
    const el = hash ? document.getElementById(hash) : null;
    if (el) el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    else if (path) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  });
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    window.addEventListener(EVENT, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(EVENT, update);
    };
  }, []);
  return path;
}

/** Anchor that routes client-side for internal paths ("/lab", "/#work"). */
export function Link({ href = "/", onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    // Same-page hash on home: let the browser scroll natively.
    if (href.startsWith("/#") && window.location.pathname === "/") return;
    e.preventDefault();
    navigate(href);
  };
  return <a href={href} onClick={handle} {...rest} />;
}
