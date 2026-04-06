// src/components/Admin/ProductsManagement.jsx
import React, { useState } from "react";

const ProductsManagement = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    image: "",
    description: "",
    size: "",
    color: "",
  });

  const categories = [
    {
      id: "men",
      name: "Men",
      subcategories: [
        "Shirts",
        "T-Shirts",
        "Jeans",
        "Trousers",
        "Jackets",
        "Shoes",
        "Accessories",
      ],
    },
    {
      id: "women",
      name: "Women",
      subcategories: [
        "Dresses",
        "Tops",
        "Skirts",
        "Jeans",
        "Jackets",
        "Shoes",
        "Handbags",
        "Accessories",
      ],
    },
    {
      id: "dresses",
      name: "Dresses",
      subcategories: [
        "Party Wear",
        "Casual Dresses",
        "Formal Dresses",
        "Maxi Dresses",
        "Mini Dresses",
        "Summer Dresses",
        "Winter Dresses",
      ],
    },
    {
      id: "accessories",
      name: "Accessories",
      subcategories: [
        "Jewelry",
        "Watches",
        "Bags",
        "Belts",
        "Hats",
        "Scarves",
        "Sunglasses",
      ],
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...formData,
                id: p.id,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
              }
            : p,
        ),
      );
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      subcategory: "",
      stock: "",
      image: "",
      description: "",
      size: "",
      color: "",
    });
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return products.length;
    return products.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="products-management">
      <div className="management-header">
        <h2>Products Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New Product
        </button>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All Products ({getCategoryCount("all")})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name} ({getCategoryCount(cat.id)})
          </button>
        ))}
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image || "https://via.placeholder.com/100"}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td>{product.subcategory || "-"}</td>
                <td>${product.price}</td>
                <td>
                  <span
                    className={`stock-badge ${product.stock < 10 ? "low-stock" : ""}`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subcategory</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.category}
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category &&
                      categories
                        .find((c) => c.id === formData.category)
                        ?.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Size</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Color</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Pink">Pink</option>
                    <option value="Purple">Purple</option>
                    <option value="Brown">Brown</option>
                    <option value="Gray">Gray</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
