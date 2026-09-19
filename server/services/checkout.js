export class CheckoutError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function validateCheckout(body) {
  if (
    !Array.isArray(body.orderItems) ||
    !body.orderItems.length ||
    body.orderItems.length > 100
  )
    throw new CheckoutError("Add at least one piece to your bag.");
  const quantities = new Map();
  for (const item of body.orderItems) {
    if (
      !item ||
      typeof item.product !== "string" ||
      !/^[a-f0-9]{24}$/i.test(item.product) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    )
      throw new CheckoutError("Please check the quantities in your bag.");
    quantities.set(
      item.product,
      (quantities.get(item.product) || 0) + item.quantity,
    );
    if (quantities.get(item.product) > 100)
      throw new CheckoutError("Please contact Orniva for bulk orders.");
  }
  const address = body.shippingAddress;
  if (
    !address ||
    ["fullName", "phone", "addressLine1", "city", "state", "postalCode"].some(
      (key) =>
        typeof address[key] !== "string" ||
        !address[key].trim() ||
        address[key].length > 200,
    )
  )
    throw new CheckoutError("Please complete your delivery address.");
  if (
    !/^[1-9][0-9]{5}$/.test(address.postalCode.trim()) ||
    !/^[+]?[0-9 ()-]{10,16}$/.test(address.phone.trim())
  )
    throw new CheckoutError(
      "Please enter a valid Indian PIN code and phone number.",
    );
  if (address.country && address.country !== "India")
    throw new CheckoutError(
      "Please contact Orniva for deliveries outside India.",
    );
  const paymentMethod = body.paymentMethod || "cod";
  if (!["cod", "whatsapp", "razorpay"].includes(paymentMethod))
    throw new CheckoutError("Please select an available payment method.");
  if (
    body.requestId &&
    (typeof body.requestId !== "string" ||
      !/^[a-z0-9-]{16,80}$/i.test(body.requestId))
  )
    throw new CheckoutError(
      "Invalid checkout request. Please refresh and try again.",
    );
  const shippingAddress = Object.fromEntries(
    [
      "fullName",
      "phone",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "postalCode",
    ].map((key) => [key, String(address[key] || "").trim()]),
  );
  return {
    quantities,
    shippingAddress: { ...shippingAddress, country: "India" },
    paymentMethod,
  };
}
export function checkoutTotals(items) {
  const itemsPrice =
    Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100,
    ) / 100;
  const shippingPrice = itemsPrice > 1999 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.03);
  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice: itemsPrice + shippingPrice + taxPrice,
  };
}
export async function reserveItems(quantities, Product, session) {
  const items = [];
  for (const [id, quantity] of quantities) {
    const product = await Product.findOneAndUpdate(
      { _id: id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true, session },
    );
    if (!product)
      throw new CheckoutError(
        "A piece in your bag is no longer available in that quantity. Please update your bag.",
        409,
      );
    const price =
      product.discountPrice > 0 && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;
    items.push({
      product: product._id,
      title: product.title,
      image: product.images?.[0] || "",
      price,
      quantity,
    });
  }
  return items;
}
