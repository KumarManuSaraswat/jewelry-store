export const siteURL = "https://orniva.netlify.app";
export const publicPages = {
  "/": {
    title: "Orniva | Everyday Jewelry & Thoughtful Gifts",
    description:
      "Meet Orniva, an online jewelry brand for everyday self-expression and thoughtful gifting. Discover earrings, necklaces, rings, bracelets and anklets.",
  },
  "/collections": {
    title: "The Jewelry Edit | Orniva",
    description:
      "Discover the Orniva jewelry edit. Explore everyday favorites, new arrivals, and thoughtfully curated jewelry for meaningful moments.",
  },
  "/shop": {
    title: "Shop Jewelry | Orniva",
    description:
      "Shop Orniva’s earrings, necklaces, rings, bracelets and anklets. Find your next everyday favorite or a thoughtful gift.",
  },
  "/about": {
    title: "Our Story | Orniva",
    description:
      "Get to know Orniva: elegant, modern jewelry for everyday wear, self-expression and meaningful gifting.",
  },
  "/contact": {
    title: "Contact Us | Orniva",
    description:
      "Talk to Orniva for help with jewelry, sizing, gifts or your order. Reach us by email, WhatsApp or Instagram.",
  },
  "/care": {
    title: "Jewelry Care | Orniva",
    description:
      "Learn how to care for, clean and store your Orniva jewelry so your everyday favorites stay beautiful.",
  },
  "/shipping-returns": {
    title: "Shipping & Returns | Orniva",
    description:
      "Orniva shipping and returns information. Complimentary shipping on orders over ₹1,999 and 30-day easy returns.",
  },
};
export function metadataFor(pathname) {
  const path = pathname.replace(/\/$/, "") || "/";
  const names = {
    "/cart": "Your Shopping Bag",
    "/wishlist": "Your Wishlist",
    "/checkout": "Checkout",
    "/login": "Sign In",
    "/register": "Create an Account",
    "/my-orders": "My Orders",
    "/forgot-password": "Reset Your Password",
  };
  const product = path.startsWith("/product/");
  return {
    ...(publicPages[path] || {
      title: `${names[path] || (path.startsWith("/admin") ? "Owner Workspace" : product ? "Jewelry for Every Day" : "Your Orniva Account")} | Orniva`,
      description: publicPages["/"].description,
    }),
    canonical: siteURL + (path === "/" ? "/" : path),
    robots: publicPages[path] || product ? "index, follow" : "noindex, follow",
  };
}
export function updatePageMetadata(pathname) {
  const metadata = metadataFor(pathname);
  document.title = metadata.title;
  function meta(attribute, key, value) {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.append(element);
    }
    element.content = value;
  }
  meta("name", "description", metadata.description);
  meta("name", "robots", metadata.robots);
  meta("property", "og:title", metadata.title);
  meta("property", "og:description", metadata.description);
  meta("property", "og:url", metadata.canonical);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = metadata.canonical;
}
