import React, { useState, useEffect } from "react";
import { CreditCard, Truck, ShoppingCart } from "lucide-react";

const PaymentCheckout = ({ productId, productDetails, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const API = import.meta.env.VITE_BACKEND_API;
  // Mock product details for demo
  const mockProduct = productDetails || {
    _id: "prod123",
    productName: "Sample Product",
    productPrice: 1999,
    productImage: "https://via.placeholder.com/200x200",
    productCompany: "Sample Company",
  };

  const totalAmount = mockProduct.productPrice * quantity;

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      if (paymentMethod === "online") {
        // Create Razorpay order
        const orderResponse = await fetch(`${API}/OrderPayment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount: totalAmount }),
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to create payment order");
        }

        const order = await orderResponse.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: "Shop Smart",
          description: `Payment for ${mockProduct.productName}`,
          handler: async (response) => {
            // Payment successful, now place the order
            await placeOrder("online", response.razorpay_payment_id, true);
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
            },
          },
          theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Cash on Delivery
        await placeOrder("cod", null, false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  const placeOrder = async (
    paymentMode,
    paymentId = null,
    paymentStatus = false
  ) => {
    try {
      const orderResponse = await fetch(
        `${API}/myInfo/orderThis/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quantity,
            paymentMode,
            paymentId,
            paymentStatus,
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to place order");
      }

      const result = await orderResponse.json();

      setOrderData({
        orderId: result.orderId || "ORD" + Date.now(),
        paymentId,
        paymentMode,
        amount: totalAmount,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      alert(
        `Order placed successfully! ${
          paymentMode === "online"
            ? "Payment completed."
            : "You will pay on delivery."
        }`
      );
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (orderData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order Confirmed!
            </h2>
            <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg mb-4">
              <p>
                <span className="font-semibold">Order ID:</span>{" "}
                {orderData.orderId}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹
                {orderData.amount}
              </p>
              <p>
                <span className="font-semibold">Payment Mode:</span>{" "}
                {orderData.paymentMode === "online"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </p>
              {orderData.paymentId && (
                <p>
                  <span className="font-semibold">Payment ID:</span>{" "}
                  {orderData.paymentId}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Product Details */}
        <div className="border-b pb-4 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={mockProduct.productImage}
              alt={mockProduct.productName}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {mockProduct.productName}
              </h3>
              <p className="text-sm text-gray-600">
                {mockProduct.productCompany}
              </p>
              <p className="text-lg font-bold text-blue-600">
                ₹{mockProduct.productPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              -
            </button>
            <span className="font-semibold text-lg w-8 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Choose Payment Method
          </h3>

          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Pay Online</div>
                <div className="text-sm text-gray-500">
                  Credit/Debit Card, UPI, Net Banking
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Truck className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-sm text-gray-500">
                  Pay when you receive the product
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                Subtotal ({quantity} item{quantity > 1 ? "s" : ""})
              </span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-2" />
              {paymentMethod === "online"
                ? `Pay ₹${totalAmount}`
                : "Place Order"}
            </>
          )}
        </button>

        {paymentMethod === "cod" && (
          <p className="text-sm text-gray-600 text-center mt-3">
            You will pay ₹{totalAmount} when the product is delivered
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentCheckout;
