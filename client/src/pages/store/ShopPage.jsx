import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import ProductCard from "../../components/product/ProductCard";
import CollectionState from "../../components/product/CollectionState";
import { categories, priceOf } from "../../utils/store";
import Icon from "../../components/Icon";
export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const { products, loading, error, retry } = useProducts();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = params.get("category") || "";
  const search = params.get("search") || "";
  const collection =
    params.get("collection") ||
    (params.get("filter") === "best-seller" ? "bestsellers" : "");
  const sort = params.get("sort") || "featured";
  const set = (key, value) => {
    // History updates synchronously, so fast consecutive controls cannot overwrite each other.
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!category || p.category === category) &&
            (!search ||
              [p.title, p.description, ...(p.materials || [])]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())) &&
            (collection !== "new" || p.isNewArrival) &&
            (collection !== "bestsellers" || p.isBestSeller) &&
            (!params.get("inStock") || p.stock > 0) &&
            (!params.get("maxPrice") ||
              priceOf(p) <= Number(params.get("maxPrice"))) &&
            (!params.get("material") ||
              p.materials?.includes(params.get("material"))),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? priceOf(a) - priceOf(b)
            : sort === "price-high"
              ? priceOf(b) - priceOf(a)
              : sort === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : Number(b.isFeatured) - Number(a.isFeatured),
        ),
    [products, category, search, collection, sort, params],
  );
  const title = search
    ? "Your search, your sparkle."
    : category
      ? category[0].toUpperCase() + category.slice(1)
      : collection === "new"
        ? "Fresh little favorites."
        : collection === "bestsellers"
          ? "The most loved edit."
          : "Your everyday, elevated.";
  return (
    <div className="page-shell">
      <div className="container">
        <div className="shop-heading">
          <p className="eyebrow">THE ORNIVA COLLECTION</p>
          <h1>{title}</h1>
          <p>
            Thoughtfully chosen. Effortlessly you. Find the piece that feels
            like yours.
          </p>
          <div className="category-pills">
            {["", ...categories].map((value) => (
              <button
                key={value}
                className={category === value ? "active" : ""}
                aria-pressed={category === value}
                onClick={() => set("category", value)}
              >
                {value || "All jewelry"}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-toolbar">
          <span className="results-count" aria-live="polite">
            {loading ? "Finding your favorites…" : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}
          </span>
          <input
            aria-label="Search collection"
            placeholder="Search the collection"
            value={search}
            onChange={(e) => set("search", e.target.value)}
          />
          <button
            className="small-action-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
          >
            <Icon name="filter" size={17} /> Filters
          </button>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => set("sort", e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
        {filtersOpen && (
          <div className="filter-panel">
            <label>
              Price up to ₹
              <input
                type="number"
                min="0"
                placeholder="Any price"
                value={params.get("maxPrice") || ""}
                onChange={(e) => set("maxPrice", e.target.value)}
              />
            </label>
            <label>
              Material
              <select
                value={params.get("material") || ""}
                onChange={(e) => set("material", e.target.value)}
              >
                <option value="">All materials</option>
                {[...new Set(products.flatMap((p) => p.materials || []))].map(
                  (m) => (
                    <option key={m}>{m}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!params.get("inStock")}
                onChange={(e) => set("inStock", e.target.checked ? "true" : "")}
              />{" "}
              In stock only
            </label>
            <button className="link-button" onClick={() => setParams({})}>
              Clear all filters
            </button>
          </div>
        )}
        <CollectionState
          loading={loading}
          error={error}
          retry={retry}
          empty={!filtered.length}
        />
        {!loading && !error && (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
