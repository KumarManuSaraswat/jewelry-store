import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { categories, money, priceOf } from "../../utils/store";
import Icon from "../../components/Icon";
const blank = {
  title: "",
  slug: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "earrings",
  images: "",
  materials: "",
  stock: 0,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
};
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [params] = useSearchParams();
  const [stock, setStock] = useState(params.get("stock") || "all");
  const [loading, setLoading] = useState(true);
  const dialog = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  async function refresh() {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/products", { signal: controller.signal })
      .then(({ data }) => setProducts(data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED") setError("Unable to load products.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  function open(product) {
    setError("");
    setSaved("");
    setEditing(product?._id || "");
    setForm(
      product
        ? {
            ...product,
            images: product.images.join("\n"),
            materials: product.materials?.join(", ") || "",
          }
        : blank,
    );
    setDialogOpen(true);
    dialog.current.showModal();
  }
  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" &&
      !editing &&
      (!prev.slug ||
        prev.slug ===
          prev.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""))
        ? {
            slug: value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock),
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      materials: form.materials
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (payload.discountPrice >= payload.price && payload.discountPrice > 0)
        throw new Error("Sale price must be less than the regular price.");
      if (editing) await api.put("/api/products/" + editing, payload);
      else await api.post("/api/products", payload);
      dialog.current.close();
      setSaved(
        editing
          ? "Your piece has been updated."
          : "Your new piece is in the collection.",
      );
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not save this piece.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await api.post("/api/upload", body);
      setForm((prev) => ({
        ...prev,
        images: [prev.images, data.imageUrl].filter(Boolean).join("\n"),
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload image.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  async function remove(product) {
    if (
      !window.confirm(
        "Delete “" +
          product.title +
          "” from the catalog? Existing order records will be kept.",
      )
    )
      return;
    setError("");
    try {
      await api.delete("/api/products/" + product._id);
      setSaved("Product removed from the catalog.");
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product.");
    }
  }
  const visible = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (stock !== "low" || p.stock <= 5) &&
      (stock !== "out" || p.stock === 0),
  );
  return (
    <div>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">THE COLLECTION</p>
          <h1>Your pieces.</h1>
          <p className="section-subtitle">
            Manage the details that make every piece special.
          </p>
        </div>
        <button className="btn-primary" onClick={() => open()}>
          <Icon name="plus" size={17} /> Add product
        </button>
      </div>
      {error && !dialogOpen && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="success-message" role="status">
          {saved}
        </p>
      )}
      <div className="admin-toolbar">
        <input
          aria-label="Search products"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter inventory"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        >
          <option value="all">All inventory</option>
          <option value="low">Low stock (5 or fewer)</option>
          <option value="out">Out of stock</option>
        </select>
        <span className="summary-note">{visible.length} products</span>
      </div>
      <div className="admin-section-card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Collections</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="table-product">
                    {p.images[0] && <img src={p.images[0]} alt="" />}
                    <div>
                      {p.title}
                      <small>{p.category}</small>
                    </div>
                  </div>
                </td>
                <td>{money(priceOf(p))}</td>
                <td>
                  <span
                    className={
                      "status-badge " + (p.stock <= 5 ? "low" : "active")
                    }
                  >
                    {p.stock} available
                  </span>
                </td>
                <td>
                  {[
                    p.isFeatured && "Featured",
                    p.isNewArrival && "New",
                    p.isBestSeller && "Best seller",
                  ]
                    .filter(Boolean)
                    .join(", ") || "All jewelry"}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="small-action-btn"
                      onClick={() => open(p)}
                    >
                      Edit
                    </button>
                    <button className="link-button" onClick={() => remove(p)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <p role="status">Loading your collection…</p>
        ) : (
          !visible.length && (
            <p className="admin-empty">No products match this view.</p>
          )
        )}
      </div>
      <dialog
        ref={dialog}
        className="edit-dialog"
        onClose={() => setDialogOpen(false)}
      >
        <div className="section-head">
          <h2>{editing ? "Edit your piece" : "Something new"}</h2>
          <button
            className="icon-button"
            aria-label="Close product editor"
            onClick={() => dialog.current.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <form className="form-grid" onSubmit={submit}>
          <label>
            Product name
            <input name="title" required value={form.title} onChange={change} />
          </label>
          <label>
            Product URL name
            <input name="slug" required value={form.slug} onChange={change} />
          </label>
          <label className="full-width">
            Description
            <textarea
              name="description"
              rows="3"
              required
              value={form.description}
              onChange={change}
            />
          </label>
          <label>
            Regular price (₹)
            <input
              type="number"
              min="1"
              step="0.01"
              name="price"
              required
              value={form.price}
              onChange={change}
            />
          </label>
          <label>
            Sale price (₹, optional)
            <input
              type="number"
              min="0"
              step="0.01"
              name="discountPrice"
              value={form.discountPrice}
              onChange={change}
            />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={change}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Available stock
            <input
              type="number"
              min="0"
              step="1"
              name="stock"
              required
              value={form.stock}
              onChange={change}
            />
          </label>
          <label className="full-width">
            Materials (separate with commas)
            <input
              name="materials"
              placeholder="18k gold plating, stainless steel"
              value={form.materials}
              onChange={change}
            />
          </label>
          <label className="full-width">
            Image URLs (one per line)
            <textarea
              name="images"
              rows="3"
              value={form.images}
              onChange={change}
            />
          </label>
          <label className="full-width">
            Upload an image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={upload}
            />
          </label>
          <div className="preview-images full-width">
            {form.images
              .split("\n")
              .filter(Boolean)
              .slice(0, 5)
              .map((url, i) => (
                <img key={i} src={url} alt={"Preview " + (i + 1)} />
              ))}
          </div>
          <div
            className="full-width"
            style={{ display: "flex", gap: 20, flexWrap: "wrap" }}
          >
            {[
              ["isFeatured", "Featured"],
              ["isNewArrival", "New arrival"],
              ["isBestSeller", "Best seller"],
            ].map(([name, label]) => (
              <label key={name}>
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name]}
                  onChange={change}
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <button className="btn-primary full-width" disabled={busy}>
            {busy
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Add to the collection"}
          </button>
        </form>
      </dialog>
    </div>
  );
}
