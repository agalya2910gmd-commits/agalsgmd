// context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

/**
 * Normalizes subcategories to match those used in ShopPage.jsx filters
 */
export function normalizeSubCategoryForShop(category, subCategory) {
  const cat = normalizeCategoryForShop(category);
  const sub = (subCategory || "").trim().toLowerCase();
  
  // High priority user-requested mappings
  if (sub.includes("shirt")) return "Shirts";
  if (sub.includes("saree")) return "Saree";
  if (sub.includes("sandal")) return "Sandals";
  if (sub.includes("accessor")) return "Accessories";
  if (sub.includes("men")) return "Men Fashion";
  if (sub.includes("women")) return "Women Fashion";

  // Existing cases
  if (sub === "t-shirt" || sub === "tshirt") return "T-Shirts";
  if (sub === "pants" || sub === "pant") return "Pants";
  
  // Fallback: Title Case
  return subCategory ? subCategory.charAt(0).toUpperCase() + subCategory.slice(1).toLowerCase() : "";
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend with cache-busting
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products?t=${Date.now()}`);
      
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const normalized = data.map(p => ({
          ...p,
          sellerAdded: true,
          subCategory: p.subcategory,
          image: p.image.startsWith("/") ? `http://localhost:5000${p.image}` : p.image,
          price: typeof p.price === 'string' ? p.price : `₹${parseFloat(p.price).toLocaleString("en-IN")}`,
        }));
        setProducts(normalized);
        return normalized;
      } else if (!response.ok) {
        const text = await response.text();
        console.error("Fetch products failed:", text);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData, sellerId) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description || "");
      formData.append("seller_id", sellerId || productData.seller_id || 1);
      formData.append("category", productData.category);
      formData.append("subcategory", normalizeSubCategoryForShop(productData.category, productData.subCategory));
      formData.append("stock", productData.stock || 0);

      // Append new fields
      const newFields = [
        "parent_product_id", "category_id", "review_id", "sku", "mrp", "stock_quantity",
        "weight", "length", "breadth", "height", "brand", "image_url",
        "variant_name", "variant_value", "is_variant", "is_active"
      ];

      newFields.forEach(field => {
        if (productData[field] !== undefined && productData[field] !== null) {
          formData.append(field, productData[field]);
        }
      });

      if (productData.imageFile) {
        formData.append("image", productData.imageFile);
      } else if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          errorMessage = err.message || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        const newProduct = {
          ...result.product,
          sellerAdded: true,
          image: result.product.image?.startsWith("/") ? `http://localhost:5000${result.product.image}` : result.product.image,
          price: `₹${parseFloat(result.product.price).toLocaleString("en-IN")}`,
          subCategory: result.product.subcategory
        };
        
        setProducts((prev) => [newProduct, ...prev]);
        return newProduct;
      } else {
        throw new Error("Unexpected response from server (Not JSON)");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        if (key === 'imageFile' && updatedData[key]) {
          formData.append("image", updatedData[key]);
        } else if (key === 'subCategory') {
          formData.append("subcategory", normalizeSubCategoryForShop(updatedData.category, updatedData.subCategory));
        } else if (updatedData[key] !== undefined && key !== 'image') {
          formData.append(key, updatedData[key]);
        }
      });
      
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update product");
      
      await fetchProducts(); 
      return true;
    } catch (error) {
      console.error("Update Error:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Ensure we have a valid ID before making the request
      if (!id || id === "undefined" || id === "null") {
        console.error("ProductContext: Cannot delete without a valid ID. Received:", id);
        throw new Error("Invalid Product ID provided for deletion.");
      }
      
      console.log(`ProductContext: Attempting to delete database product [ID: ${id}]`);
      
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("ProductContext: Delete API failed:", errorData);
        throw new Error(errorData.message || "Server rejected the deletion request.");
      }
      
      const successData = await response.json().catch(() => ({}));
      console.log("ProductContext: Delete successful:", successData);
      
      // Critical: Re-fetch the latest product list from database to sync all pages
      await fetchProducts(); 
      return true;
    } catch (error) {
      console.error("ProductContext: Global Delete Error:", error);
      throw error;
    }
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
