import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../../components/product/ProductCard";

const categories = [
  { label: "All Jewelry", value: "" },
  { label: "Rings", value: "rings" },
  { label: "Earrings", value: "earrings" },
  { label: "Bracelets", value: "bracelets" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Anklets", value: "anklets" },
];

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `/products?category=${selectedCategory}`
          : "/products";

        const { data } = await api.get(url);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const shopHeading = useMemo(() => {
    if (!selectedCategory) return "All Jewelry";
    return (
      categories.find((item) => item.value === selectedCategory)?.label ||
      "Jewelry"
    );
  }, [selectedCategory]);

  const handleCategoryChange = (value) => {
    if (!value) {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  return (
    <div className="page-shell">
      <div className="container">
        <div className="shop-layout">
          <aside className="shop-sidebar">
            <h2 className="filter-title">Shop</h2>
            <p className="section-subtitle">
              Explore the collection by category and browse pieces suited for
              everyday wear, gifting, and occasion styling.
            </p>

            <div className="filter-group">
              <h4>Categories</h4>
              <div className="filter-list">
                {categories.map((category) => (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() => handleCategoryChange(category.value)}
                    className={`filter-chip ${
                      selectedCategory === category.value ? "active" : ""
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div className="shop-topbar">
              <div>
                <p className="eyebrow">ORNIVA Collection</p>
                <h1 className="section-title" style={{ marginTop: 0 }}>
                  {shopHeading}
                </h1>
              </div>

              <p className="shop-count">{products.length} products</p>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;