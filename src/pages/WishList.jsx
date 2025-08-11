import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { btnContext } from "../context/ButtonContext";
import { ArrowLeft } from "lucide-react";
import PaymentCheckout from "./PaymentCheckout";

const WishList = () => {
  const [wishList, setWishList] = useState([]);
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const {
    handleCart,
    showCheckout,
    selectedProduct,
    handleBuyNow,
    handleOrderSuccess,
    handleCloseCheckout,
  } = useContext(btnContext);
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    fetchWishList();
  }, []);

  const fetchWishList = async () => {
    try {
      const response = await axios.get(`${API}/myInfo/wishList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishList(response.data.wishList);
      console.log(response.data.wishList);
    } catch (error) {
      console.error("Something went wrong - wishList", error);
    }
  };

  const handleRemoveFromWishList = async (productId) => {
    try {
      await axios.delete(`${API}/myInfo/removeFromWishList/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchWishList();
      console.log("Product removed from wishList");
    } catch (error) {
      console.log(
        "Something went wrong while removing product from wishList",
        error
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 mt-[4%]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="flex flex-row gap-3 mb-4 text-bold text-gray-800"
        >
          <ArrowLeft /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Wishlist
          </h1>
          <p className="text-slate-600">{wishList.length} items saved</p>
        </div>

        {wishList.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Category</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            </div>

            {/* Product List */}
            <div className="divide-y divide-slate-200">
              {wishList.map((item, index) => (
                <div
                  key={item.product._id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors duration-150"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-6 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.productImage || "/placeholder.svg"}
                          alt={item.product.productName}
                          className="w-16 h-16 object-cover rounded-md border border-slate-200"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-slate-900 truncate">
                          {item.product.productName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Added on{" "}
                          {new Date(item.addedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-semibold text-slate-900">
                        ₹{item.product.productPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {item.product.category}
                      </span>
                    </div>

                    {/* Actions */}
                    {user && user.role === "user" && (
                      <div className="col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={() => handleCart(item.product._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
                            />
                          </svg>
                          Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(item.product)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Buy
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveFromWishList(item.product._id)
                          }
                          className="inline-flex items-center p-1.5 border border-transparent text-xs font-medium rounded-md text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150"
                          title="Remove from wishlist"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{wishList.length}</span> items
                  </div>
                  <div className="text-sm text-slate-600">
                    Total value:{" "}
                    <span className="font-medium">
                      ₹
                      {wishList
                        .reduce(
                          (total, item) => total + item.product.productPrice,
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg border border-slate-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-slate-500 mb-6">
                Start adding items you love to your wishlist
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-150"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
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

export default WishList;
