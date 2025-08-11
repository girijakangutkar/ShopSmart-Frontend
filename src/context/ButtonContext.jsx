import axios from "axios";
import React, { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const btnContext = createContext(null);

const ButtonContext = ({ children }) => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const API = import.meta.env.VITE_BACKEND_API;

  const handleCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to cart");
        navigate("/login");
        return;
      }
      const info = await axios.put(
        `${API}/myInfo/addToCart/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Added to the cart`);
      console.log("Added to the cart", info);
    } catch (error) {
      console.log("Something went wrong while adding to cart", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleBuyNow = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to purchase items");
      navigate("/login");
      return;
    }
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const handleOrderSuccess = (orderData) => {
    console.log("Order placed successfully:", orderData);
    setShowCheckout(false);
    setSelectedProduct(null);
    navigate("/");
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedProduct(null);
  };

  const handleWishList = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to wishlist");
        navigate("/login");
        return;
      }

      const response = await axios.patch(
        `${API}/myInfo/addToWishList/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Added to the wishList");
      console.log("Added to the wishList", response.data);
    } catch (error) {
      console.log("Something went wrong while adding wishList", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };
  return (
    <btnContext.Provider
      value={{
        handleCart,
        showCheckout,
        handleWishList,
        selectedProduct,
        handleBuyNow,
        handleOrderSuccess,
        handleCloseCheckout,
      }}
    >
      {children}
    </btnContext.Provider>
  );
};

export default ButtonContext;
