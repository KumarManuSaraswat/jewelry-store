import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { orderTotals, priceOf, readStorage, saveStorage } from "../utils/store";
const CartContext = createContext();
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = readStorage("orniva-bag", []);
    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item.product &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            Number.isFinite(item.price),
        )
      : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = readStorage("orniva-wishlist", []);
    return Array.isArray(saved)
      ? saved.filter((item) => item && item._id && item.slug && item.title)
      : [];
  });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    saveStorage("orniva-bag", cartItems);
  }, [cartItems]);
  useEffect(() => {
    saveStorage("orniva-wishlist", wishlist);
  }, [wishlist]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  function addToCart(product, quantity = 1) {
    const id = product._id || product.product;
    const stock = product.stock ?? product.countInStock ?? 0;
    if (!id || stock < 1 || !Number.isInteger(quantity) || quantity < 1) return;
    const existing = cartItems.find((item) => item.product === id);
    if (existing && existing.quantity >= stock) {
      setNotice("You already have all available pieces in your bag.");
      return;
    }
    setCartItems((items) => {
      const found = items.find((item) => item.product === id);
      return found
        ? items.map((item) =>
            item.product === id
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, stock),
                  countInStock: stock,
                  price: priceOf(product),
                }
              : item,
          )
        : [
            ...items,
            {
              product: id,
              slug: product.slug,
              title: product.title,
              image: product.images?.[0] || product.image || "",
              price: priceOf(product),
              countInStock: stock,
              quantity: Math.min(quantity, stock),
            },
          ];
    });
    setNotice(product.title + " added to your bag");
  }
  function updateCartQuantity(id, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.product === id
          ? { ...item, quantity: Math.min(quantity, item.countInStock) }
          : item,
      ),
    );
  }
  function toggleWishlist(product) {
    setWishlist((items) =>
      items.some((item) => item._id === product._id)
        ? items.filter((item) => item._id !== product._id)
        : [...items, product],
    );
  }
  const totals = useMemo(() => orderTotals(cartItems), [cartItems]);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart: (id) =>
          setCartItems((items) => items.filter((item) => item.product !== id)),
        clearCart: () => setCartItems([]),
        totals,
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
      <div
        role="status"
        aria-live="polite"
        className={"toast " + (notice ? "visible" : "")}
      >
        {notice}
      </div>
    </CartContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
