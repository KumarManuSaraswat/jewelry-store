export const money = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const priceOf = (product) =>
  product.discountPrice > 0 && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
export const categories = [
  "earrings",
  "necklaces",
  "rings",
  "bracelets",
  "anklets",
];
export const whatsapp = (message) =>
  "https://wa.me/917231932107?text=" + encodeURIComponent(message);
export function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Continue when storage is unavailable. */
  }
}
export function orderTotals(items) {
  const itemsPrice =
    Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100,
    ) / 100;
  const shippingPrice = items.length && itemsPrice <= 1999 ? 99 : 0;
  const taxPrice = Math.round(itemsPrice * 0.03);
  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice: itemsPrice + shippingPrice + taxPrice,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
