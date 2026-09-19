import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Content is visible by default. Observers only add finite, cancellable animation.
export default function SiteMotion() {
  const { pathname } = useLocation();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map();
    let intersection;
    let mutations;
    const selectors =
      "[data-reveal], .section-head, .category-tile, .product-card, .story-image, .story-copy, .testimonial-grid blockquote, .why-card, .analytics-card, .footer-top";
    function animate(node, delay = 0, distance = 20, duration = 600) {
      if (!node.animate || node.contains(document.activeElement)) return;
      const animation = node.animate(
        [
          { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration,
          delay,
          easing: "cubic-bezier(.22, 1, .36, 1)",
          fill: "backwards",
        },
      );
      animations.set(node, animation);
      animation.onfinish = () => animations.delete(node);
    }
    function stop() {
      intersection?.disconnect();
      mutations?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    function start() {
      stop();
      if (preference.matches || !window.IntersectionObserver) return;
      const seen = new WeakSet();
      intersection = new IntersectionObserver(
        (entries) => {
          let stagger = 0;
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            intersection.unobserve(target);
            animate(target, Math.min(stagger++ * 65, 195));
          });
        },
        { threshold: 0.08 },
      );
      function observe(scope) {
        const nodes = [
          ...(scope.matches?.(selectors) ? [scope] : []),
          ...scope.querySelectorAll(selectors),
        ];
        nodes.forEach((node) => {
          if (seen.has(node)) return;
          seen.add(node);
          intersection.observe(node);
        });
      }
      observe(document);
      mutations = new MutationObserver((records) =>
        records.forEach((record) =>
          record.addedNodes.forEach((node) => {
            if (node.nodeType === 1) observe(node);
          }),
        ),
      );
      const root = document.getElementById("root");
      if (root) mutations.observe(root, { childList: true, subtree: true });
      const surface = document.querySelector(
        "main > .page-shell, main > .auth-shell, .admin-content > div",
      );
      if (surface) animate(surface, 0, 7, 260);
    }
    // A focused control must never remain transparent during a reveal delay.
    function onFocus(event) {
      animations.forEach((animation, node) => {
        if (node.contains(event.target)) {
          animation.cancel();
          animations.delete(node);
        }
      });
    }
    start();
    preference.addEventListener("change", start);
    document.addEventListener("focusin", onFocus);
    return () => {
      stop();
      preference.removeEventListener("change", start);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);
  return null;
}
