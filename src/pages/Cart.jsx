import axios from "axios";
import React, { useEffect, useState } from "react";
import { Trash2, ShoppingCart, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { btnContext } from "../context/ButtonContext";
import PaymentCheckout from "./PaymentCheckout";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const {
    showCheckout,
    selectedProduct,
    handleBuyNow,
    handleOrderSuccess,
    handleCloseCheckout,
  } = useContext(btnContext);
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const info = await axios.get(`${API}/myInfo/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(info.data.cart);
      // console.log("Fetched cart", info);
    } catch (error) {
      console.log("Something went wrong while fetching cart");
    }
  };

  const handleRemove = async (id) => {
    try {
      const info = await axios.delete(
        `http://localhost:3000/myInfo/removeFromCart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("Deleted", info);
      setCart(info.data.cart);
    } catch (error) {
      console.log("Something went wrong while deleting cart item");
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const validCartItems = cart.filter((item) => item.product);

  const calculateTotal = () => {
    return validCartItems.reduce((total, item) => {
      return total + item.product.productPrice * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (validCartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8  mt-[5%]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>
        </div>

        <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-white rounded-full p-6 shadow-sm mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-[5%]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {validCartItems.length}{" "}
            {validCartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(calculateTotal())}
          </p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {validCartItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={item.product.productImage || "/placeholder.svg"}
                    alt={item.product.productName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product.productName?.toUpperCase() ||
                        "Product Name"}
                    </h3>
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(item.product.productPrice || 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPrice(item.product.productPrice * item.quantity)}{" "}
                      total
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>

                      <div className="px-4 py-2 bg-white border-x border-gray-200 min-w-[60px] text-center">
                        <span className="font-medium text-gray-900">
                          {item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Remove item from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Order Summary
            </h3>
            <p className="text-sm text-gray-600">
              {validCartItems.reduce((total, item) => total + item.quantity, 0)}{" "}
              items
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(calculateTotal())}
              </p>
            </div>

            <button
              // onClick={(e) => {
              //   e.stopPropagation();
              //   handleBuyNow(validCartItems);
              // }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 whitespace-nowrap"
            >
              <ShoppingBag className="w-5 h-5" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          ← Continue Shopping
        </button>
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

export default Cart;
