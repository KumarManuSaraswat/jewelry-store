# Orniva design and commerce research

Reviewed 20 September 2026. These are current reference patterns from established brands and platforms, not a claim that the sites are ranked by popularity or conversion rate.

| Reference | Observed pattern | Orniva implementation |
| --- | --- | --- |
| [Mejuri](https://mejuri.com/collections/best-selling-necklaces) | Category-based best sellers, visible material choices, price and material filters, concise product cards. | Simple cards, real prices, real review counts only, category/material/price filters, and stock-aware adding. |
| [Missoma](https://www.missoma.com/) | Collection and category navigation, best-seller edits, saved favorites, visible service promises, and care resources. | Editorial typography and photography, permanent jewelry categories, new/best-seller edits, wishlist, service strip, and care information. |
| [GIVA](https://www.giva.co/) | Jewelry browsing by category, price, metal, and style, with India-focused shipping and gifting navigation. | INR formatting, India address fields, PIN validation, clear shipping costs, and category/price/material discovery. No unsupported material claims added. |
| [Etsy](https://www.etsy.com/) | Prominent search, favorites on cards, topical collections, and shopping by interest. | Accessible header search, per-piece wishlist buttons, and discovery through collections. |
| [Shopify Checkout](https://help.shopify.com/en/manual/checkout-settings) | Inventory checks during checkout, clear address/payment steps, and access to store policies. | Explicit totals, server-authoritative prices, transactional stock reservations, duplicate-order protection, and shipping/returns access. |
| [WooCommerce order management](https://woocommerce.com/document/managing-orders/) | Searchable order overview, fulfillment statuses, and detailed order management for store owners. | Search/filter/export, order details, paid status, tracking fields, and owner-only access. |

## Visual direction

Deep plum gives Orniva a recognizable accent across storefront and owner tools. Ivory surfaces, open spacing, a high-contrast serif, and a centered wordmark create a fashion editorial character without hiding navigation or commerce actions. The supplied portrait remains the main brand image. Existing collection imagery is retained; competitor photography and logos were not copied.

The customer journey is browse → product → bag → sign-in → delivery/payment choice → confirmation and tracking. Bag and wishlist are local to the device; orders, products, stock, customers, and team roles belong to the backend.

The owner workspace emphasizes daily decisions: orders to fulfill, pieces to restock, paid sales, and recent orders. Product data is edited through labeled fields and galleries; order status and tracking are managed together.

## Decisions grounded in the existing store

- Preserve the actual three product records instead of inventing an attractive catalog.
- Keep the supplied shipping threshold, ₹99 shipping charge, tax calculation, and 30-day return promise.
- Preserve contact email, phone number, Instagram account, and existing testimonials. Do not manufacture ratings for products with zero reviews.
- Keep COD and WhatsApp ordering while making provider-based payment conditional on configuration.
- Replace presentational forms and placeholder links with working contact paths. Do not invent legal policies or delivery guarantees.
- Retain Netlify and Render rather than require a paid platform migration.

## Validation boundaries

The public Render catalog was read successfully. The redesign, build, lint checks, isolated browser journey, and backend regression tests were verified locally. The updated backend, real database transactions, live payment acceptance, recovery email, and publication require deployment and staging verification as described in the project README.
