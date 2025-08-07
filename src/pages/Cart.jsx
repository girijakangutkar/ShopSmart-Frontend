import axios from "axios";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const info = await axios.get("http://localhost:3000/myInfo/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(info.data.cart);
      console.log("Fetched cart", info);
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
      console.log("Deleted", info);
      setCart(info.data.cart);
    } catch (error) {
      console.log("Something went wrong while deleting cart item");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center align-center w-full mt-[5%]">
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item._id} className="flex flex-row justify-between w-[40%]">
            <div className="flex items-center justify-center w-[20%] border">
              <img
                src={item.product.productImage}
                alt={item.product.productName}
                style={{ height: "90px", width: "90px", borderRadius: "50%" }}
                className="w-full h-40 object-cover rounded mb-3"
              />
            </div>
            <div className="flex flex-col items-left justify-left w-[80%] border">
              <h3 className="text-lg font-semibold">
                {item.product.productName}
              </h3>
              <p className="text-sm text-gray-600">
                ₹ {item.product.productPrice}
              </p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <button onClick={() => handleRemove(item.product._id)}>
              Remove from cart
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
