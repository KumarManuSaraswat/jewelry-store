import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "rings",
  images: "",
  stock: "",
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
};

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      category: product.category || "rings",
      images: product.images?.[0] || "",
      stock: product.stock || "",
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);

      const { data } = await api.post("/api/upload", uploadData, {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        images: data.imageUrl,
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const buildPayload = () => ({
    ...formData,
    price: Number(formData.price),
    discountPrice: Number(formData.discountPrice) || 0,
    stock: Number(formData.stock),
    images: formData.images ? [formData.images] : [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, buildPayload(), getAuthConfig());
        alert("Product updated successfully");
      } else {
        await api.post("/api/products", buildPayload(), getAuthConfig());
        alert("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Product action failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      await api.delete(`api/products/${id}`, getAuthConfig());
      alert("Product deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Manage Products</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "700px",
          marginBottom: "40px",
          padding: "20px",
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          background: "#fff",
        }}
      >
        <h2 style={{ fontSize: "20px" }}>
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="slug"
          placeholder="Slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          name="discountPrice"
          type="number"
          placeholder="Discount Price"
          value={formData.discountPrice}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="rings">Rings</option>
          <option value="earrings">Earrings</option>
          <option value="bracelets">Bracelets</option>
          <option value="necklaces">Necklaces</option>
          <option value="anklets">Anklets</option>
        </select>

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="images"
          placeholder="Image URL"
          value={formData.images}
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading && <p>Uploading image...</p>}

        {formData.images && (
          <img
            src={formData.images}
            alt="Preview"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        )}

        <label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          Featured
        </label>

        <label>
          <input
            type="checkbox"
            name="isNewArrival"
            checked={formData.isNewArrival}
            onChange={handleChange}
          />
          New Arrival
        </label>

        <label>
          <input
            type="checkbox"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleChange}
          />
          Best Seller
        </label>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{
              padding: "12px 18px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "12px 18px",
                background: "#f4f4f4",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div style={{ display: "grid", gap: "16px" }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "12px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3>{product.title}</h3>
                <p>Slug: {product.slug}</p>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <p>Discount: ₹{product.discountPrice || 0}</p>
                <p>Stock: {product.stock}</p>
                <p>
                  Flags:
                  {product.isFeatured ? " Featured" : ""}
                  {product.isNewArrival ? " NewArrival" : ""}
                  {product.isBestSeller ? " BestSeller" : ""}
                  {!product.isFeatured &&
                  !product.isNewArrival &&
                  !product.isBestSeller
                    ? " None"
                    : ""}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #111",
                    background: "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product._id)}
                  style={{
                    padding: "10px 14px",
                    border: "none",
                    background: "#b42318",
                    color: "#fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductsPage;