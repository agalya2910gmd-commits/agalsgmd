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
  
  // High priority specific mappings
  if (sub === "t-shirt" || sub === "tshirt" || sub.includes("t-shirt") || sub.includes("tshirt")) return "T-Shirts";
  if (sub.includes("printed shirt")) return "Printed Shirts";
  if (sub.includes("saree")) return "Saree";
  if (sub.includes("western dress")) return "Western Dress";
  if (sub.includes("jewelry") || sub.includes("jewel")) return "Jewelry";
  if (sub.includes("sandal")) return "Sandals";
  if (sub.includes("pant") || sub.includes("chino") || sub.includes("jeans")) return "Pants";
  if (sub.includes("shirt")) return "Shirts"; // Lower priority catch-all for shirts
  
  // Title Case for others
  return subCategory 
    ? subCategory.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : "";
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
        console.log(`[ProductContext] API returned ${data.length} raw products. Syncing state...`);
        console.log("[ProductContext DEBUG] First product seller_id:", data[0]?.seller_id);
        const normalized = data.map(p => {
          const mainImage = p.image?.startsWith("/") ? `http://localhost:5000${p.image}` : (p.image || "");
          const formattedPrice = `₹${parseFloat(p.price || 0).toLocaleString("en-IN")}`;
          const formattedMRP = `₹${parseFloat(p.mrp || p.price || 0).toLocaleString("en-IN")}`;
          
          // Normalize category and subcategory to match ShopPage filters
          const normalizedCategory = normalizeCategoryForShop(p.category);
          const normalizedSubCategory = normalizeSubCategoryForShop(p.category, p.subcategory);
          
          return {
            ...p,
            sellerAdded: true,
            category: normalizedCategory,
            subCategory: normalizedSubCategory,
            originalSubCategory: p.subcategory, // Keep original for reference if needed
            image: mainImage,
            images: [mainImage],
            price: formattedPrice,
            originalPrice: formattedMRP,
            rating: p.rating || 4.5,
            reviews: p.reviews || Math.floor(Math.random() * 200) + 50,
            tag: p.tag || "NEW IN",
            discount: p.offers || p.offer || p.discount || "",
            offer: p.offers || p.offer || p.discount || "",
            colors: p.available_colors ? p.available_colors.split(',').map(s => s.trim()) : ["Standard"],
            colorNames: p.available_colors ? p.available_colors.split(',').map(s => s.trim()) : ["Standard"],
            sizes: p.available_sizes ? p.available_sizes.split(',').map(s => s.trim()) : ["S", "M", "L", "XL"],
            highlights: p.description ? [p.description.substring(0, 100) + "..."] : ["Premium quality product"],
            reviewsList: [] 
          };
        });
        console.log(`[ProductContext] Normalized ${normalized.length} products for Shop visibility`);
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
      console.log(`[ProductContext] STEP 1: Starting addProduct for ${productData.name}`);
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description || "");
      
      const finalSellerId = sellerId || productData.seller_id;
      console.log(`[ProductContext] STEP 2: Using seller_id: ${finalSellerId}`);
      if (finalSellerId) {
        formData.append("seller_id", finalSellerId);
      }
      
      formData.append("category", productData.category);
      try {
        const sub = normalizeSubCategoryForShop(productData.category, productData.subCategory);
        formData.append("subcategory", sub);
      } catch (e) {
        console.warn("[ProductContext] Normalization failed:", e.message);
        formData.append("subcategory", productData.subCategory || "");
      }
      
      formData.append("stock", productData.stock || 0);

      // Append new fields
      const newFields = [
        "parent_product_id", "category_id", "review_id", "sku", "mrp", "stock_quantity",
        "weight", "length", "breadth", "height", "brand", "image_url",
        "variant_name", "variant_value", "is_variant", "is_active",
        "available_sizes", "available_colors", "coupon_details", "offers", "measurements"
      ];

      newFields.forEach(field => {
        const val = productData[field];
        if (val !== undefined && val !== null) {
          formData.append(field, val);
        } else if (field === 'offers' && productData.discount) {
          formData.append('offers', productData.discount);
        }
      });

      if (productData.imageFile) {
        formData.append("image", productData.imageFile);
      } else if (productData.image) {
        formData.append("image", productData.image);
      }

      console.log(`[ProductContext] STEP 3: Sending POST to http://localhost:5000/api/products`);
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      console.log(`[ProductContext] STEP 4: Response received (Status: ${response.status})`);
      const contentType = response.headers.get("content-type");
      
      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          errorMessage = err.message || errorMessage;
        }
        console.error(`[ProductContext] STEP 5: Failure`, errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`[ProductContext] STEP 6: Success! Syncing...`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchProducts(); 
      console.log("[ProductContext] STEP 7: Global state synchronized.");        
      return result.product;
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
        fetchProducts,
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
