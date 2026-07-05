import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product === product._id);

      if (existing) {
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          product: product._id,
          slug: product.slug,
          title: product.title,
          image: product.images?.[0] || "",
          price:
            product.discountPrice > 0 ? product.discountPrice : product.price,
          countInStock: product.stock || 0,
          quantity,
        },
      ];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.product === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const clearCart = () => setCartItems([]);

  const totals = useMemo(() => {
    const itemsPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 1999 ? 0 : cartItems.length ? 99 : 0;
    const taxPrice = Math.round(itemsPrice * 0.03);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);