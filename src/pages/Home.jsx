import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { debounce } from "lodash";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { btnContext } from "../context/ButtonContext";
import { Heart, ShoppingCart, CreditCard, Package } from "lucide-react";
import PaymentCheckout from "./PaymentCheckout";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [wishListIds, setWishListIds] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortOrder: "asc",
  });
  const { user } = useContext(authContext);
  const {
    handleCart,
    showCheckout,
    selectedProduct,
    handleBuyNow,
    handleOrderSuccess,
    handleCloseCheckout,
  } = useContext(btnContext);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    debounceFetch();
    if (user && user.role === "user") {
      fetchWishList();
    }
    return () => debounceFetch.cancel();
  }, [filters]);

  const handleProductClick = useCallback(
    (productId, productName) => {
      // console.log("Clicking product:", productId, productName);
      navigate(`/productDetails/${productId}`);
    },
    [navigate]
  );

  const fetchWishList = async () => {
    try {
      const response = await axios.get(`${API}/myInfo/wishList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const ids = response.data.wishList.map((item) => item.product._id);
      setWishListIds(ids);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const toggleWishList = async (productId) => {
    if (!user) {
      alert("Please login to add items to your wishlist");
      navigate("/login");
      return;
    }
    try {
      if (wishListIds.includes(productId)) {
        await axios.delete(`${API}/myInfo/removeFromWishList/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.patch(
          `${API}/myInfo/addToWishList/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      fetchWishList();
    } catch (error) {
      console.error("Error toggling wishlist", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") queryParams.append(key, value);
      });

      const response = await axios.get(
        `${API}/wareHouse/public/products?${queryParams.toString()}`
      );
      setProducts(response.data.productData);
    } catch (error) {
      console.log("Something went wrong", error);
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      }
    }
  };

  const debounceFetch = useMemo(() => debounce(fetchProducts, 300), [filters]);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API}/wareHouse/deleteProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
      fetchWishList();
      console.log("Deleted successfully");
    } catch (error) {
      console.log("Something went wrong while deleting product");
    }
  };

  const requireAuth = (action, ...args) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }
    action(...args);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 p-4 md:p-8 gap-6 mt-[4%]">
      {/* Filters Sidebar - Collapsible on mobile */}
      <div className="w-full md:w-64 lg:w-72 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-medium text-lg mb-4 text-gray-800">Filters</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Product name..."
              value={filters.name}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="books">Books</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                placeholder="Min"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                value={filters.maxPrice}
                type="number"
                placeholder="Max"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 relative"
              >
                {/* Product Image with Wishlist Button */}
                <div className="relative">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() =>
                      handleProductClick(item._id, item.productName)
                    }
                  />

                  {/* Wishlist Button - Absolute positioned */}
                  {user && user.role === "user" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishList(item._id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={20}
                        color={
                          wishListIds.includes(item._id) ? "#ef4444" : "#9ca3af"
                        }
                        fill={
                          wishListIds.includes(item._id) ? "#ef4444" : "none"
                        }
                        weight={
                          wishListIds.includes(item._id) ? "fill" : "regular"
                        }
                      />
                    </button>
                  )}
                </div>

                {/* Product Info - Clickable area */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleProductClick(item._id, item.productName)}
                >
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-lg font-semibold text-blue-600">
                    ₹{item.productPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.productCompany}
                  </p>
                </div>

                {/* Action Buttons */}

                <div className="px-4 pb-4">
                  {user && (user.role == "admin" || user.role == "seller") ? (
                    <div className="flex gap-3"></div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          requireAuth(handleCart, item._id);
                        }}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          requireAuth(handleBuyNow, item);
                        }}
                      >
                        <CreditCard size={16} />
                        Buy Now
                      </button>
                    </div>
                  )}
                  {user && user.role !== "user" && (
                    <div className="flex gap-3">
                      <button
                        className="flex-1 py-2 bg-blue-500 bg-opacity-40 border-2 border-blue-600 hover:bg-blue-400 text-white rounded-md transition-colors text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`editProduct/${item._id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 py-2 bg-red-500 bg-opacity-40 border-2 border-red-600 hover:bg-red-400 text-white rounded-md transition-colors text-sm font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(item._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedProduct && (
        <PaymentCheckout
          productId={selectedProduct._id}
          productDetails={selectedProduct}
          onClose={handleCloseCheckout}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

export default Home;
