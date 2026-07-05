import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      isFeatured,
      isNewArrival,
      isBestSeller,
      search,
      limit,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (isFeatured) filter.isFeatured = isFeatured === "true";
    if (isNewArrival) filter.isNewArrival = isNewArrival === "true";
    if (isBestSeller) filter.isBestSeller = isBestSeller === "true";
    if (search) filter.title = { $regex: search, $options: "i" };

    let query = Product.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};