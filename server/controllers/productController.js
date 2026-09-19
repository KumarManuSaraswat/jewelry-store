import Product from "../models/Product.js";
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function payload(body) {
  const keys = [
    "title",
    "slug",
    "description",
    "price",
    "discountPrice",
    "category",
    "images",
    "stock",
    "materials",
    "isFeatured",
    "isNewArrival",
    "isBestSeller",
    "tags",
  ];
  const data = Object.fromEntries(
    keys.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]),
  );
  if (
    typeof data.title !== "string" ||
    !data.title.trim() ||
    typeof data.slug !== "string" ||
    !data.slug.trim() ||
    typeof data.description !== "string" ||
    !data.description.trim()
  )
    throw new Error("Name, URL name, and description are required.");
  if (
    !Number.isFinite(data.price) ||
    data.price <= 0 ||
    !Number.isInteger(data.stock) ||
    data.stock < 0
  )
    throw new Error(
      "Enter a positive price and a whole-number stock quantity.",
    );
  if (
    data.discountPrice !== undefined &&
    (!Number.isFinite(data.discountPrice) ||
      data.discountPrice < 0 ||
      (data.discountPrice > 0 && data.discountPrice >= data.price))
  )
    throw new Error("Sale price must be lower than the regular price.");
  if (
    data.images &&
    (!Array.isArray(data.images) ||
      data.images.length > 12 ||
      data.images.some(
        (url) => typeof url !== "string" || !/^https:\/\//i.test(url),
      ))
  )
    throw new Error("Use up to 12 HTTPS image URLs.");
  return data;
}
export const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (typeof req.query.category === "string")
      filter.category = req.query.category;
    for (const key of ["isFeatured", "isNewArrival", "isBestSeller"])
      if (req.query[key]) filter[key] = req.query[key] === "true";
    if (typeof req.query.search === "string")
      filter.title = {
        $regex: escapeRegex(req.query.search.slice(0, 120)),
        $options: "i",
      };
    let query = Product.find(filter).sort({ createdAt: -1 });
    if (req.query.limit)
      query = query.limit(
        Math.max(1, Math.min(500, parseInt(req.query.limit, 10) || 100)),
      );
    res.json(await query);
  } catch {
    res.status(500).json({ message: "Unable to load the collection." });
  }
};
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Unable to load this piece." });
  }
};
export const createProduct = async (req, res) => {
  try {
    res.status(201).json(await Product.create(payload(req.body)));
  } catch (error) {
    res
      .status(error.code === 11000 ? 409 : 400)
      .json({
        message:
          error.code === 11000
            ? "That product URL name is already in use."
            : error.message,
      });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    Object.assign(product, payload({ ...product.toObject(), ...req.body }));
    res.json(await product.save());
  } catch (error) {
    res
      .status(error.code === 11000 ? 409 : 400)
      .json({
        message:
          error.code === 11000
            ? "That product URL name is already in use."
            : error.message,
      });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product removed." });
  } catch {
    res.status(400).json({ message: "Unable to remove this product." });
  }
};
