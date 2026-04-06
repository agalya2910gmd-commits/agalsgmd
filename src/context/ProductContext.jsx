// context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

// ─── CATEGORY NORMALIZATION ───────────────────────────────────────────────────
export function normalizeCategoryForShop(category) {
  if (!category) return "Accessories";
  const c = category.toLowerCase().trim();
  if (
    c === "men" ||
    c === "apparel" ||
    c === "tops" ||
    c === "outerwear" ||
    c === "ethnic"
  )
    return "Men";
  if (c === "women") return "Women";
  if (c === "accessories" || c === "footwear" || c === "bottomwear")
    return "Accessories";
  return category;
}

export function normalizeSubCategoryForShop(category, subCategory) {
  const cat = normalizeCategoryForShop(category);
  const sub = (subCategory || "").toLowerCase().trim();

  if (cat === "Men") {
    if (
      sub.includes("t-shirt") ||
      sub.includes("tshirt") ||
      sub.includes("tee") ||
      sub.includes("polo")
    )
      return "T-Shirts";
    if (sub.includes("print")) return "Printed Shirts";
    if (sub.includes("shirt")) return "Shirts";
    if (
      sub.includes("pant") ||
      sub.includes("chino") ||
      sub.includes("jean") ||
      sub.includes("trouser") ||
      sub.includes("denim")
    )
      return "Pants";
    return "Shirts";
  }

  if (cat === "Women") {
    if (sub.includes("saree") || sub.includes("sari")) return "Saree";
    if (
      sub.includes("western") ||
      sub.includes("dress") ||
      sub.includes("top") ||
      sub.includes("skirt")
    )
      return "Western Dress";
    return "Western Dress";
  }

  if (cat === "Accessories") {
    if (
      sub.includes("jewel") ||
      sub.includes("ring") ||
      sub.includes("necklace") ||
      sub.includes("earring") ||
      sub.includes("bracelet")
    )
      return "Jewelry";
    if (
      sub.includes("sandal") ||
      sub.includes("shoe") ||
      sub.includes("footwear") ||
      sub.includes("sneaker")
    )
      return "Sandals";
    return "Jewelry";
  }

  return subCategory || "";
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("seller_products");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("seller_products", JSON.stringify(products));
    } catch {}
  }, [products]);

  const addProduct = (product) => {
    const newId = Date.now();
    const price = parseFloat(product.price) || 0;
    const originalPrice = Math.round(price / 0.7);

    const category = normalizeCategoryForShop(product.category);
    const subCategory = normalizeSubCategoryForShop(
      product.category,
      product.subCategory || product.subcategory || "",
    );

    const newProduct = {
      id: newId,
      name: product.name || "Unnamed Product",
      category,
      subCategory,
      price: `₹${price.toLocaleString("en-IN")}`,
      originalPrice: `₹${originalPrice.toLocaleString("en-IN")}`,
      discount: `${Math.round((1 - price / originalPrice) * 100)}% OFF`,
      rating: 0,
      reviews: 0,
      image:
        product.image ||
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=90&auto=format&fit=crop",
      images: product.images || [
        product.image ||
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=90&auto=format&fit=crop",
      ],
      tag: product.tag || "NEW IN",
      colors: product.colors || ["#1C1C1C", "#FFFFFF"],
      colorNames: product.colorNames || ["Black", "White"],
      sizes: product.sizes || ["S", "M", "L", "XL"],
      description: product.description || "",
      material: product.material || "",
      care: "Machine wash cold.",
      brand: product.brand || "Nivest",
      inStock: (parseInt(product.stock) || 0) > 0,
      stock: parseInt(product.stock) || 0,
      delivery: "Free delivery in 3-5 days",
      returns: "30 days easy returns",
      warranty: "3 months warranty",
      highlights: [],
      reviewsList: [],
      sales: 0,
      sellerAdded: true,
    };

    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductById = (id) => products.find((p) => p.id === id);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
