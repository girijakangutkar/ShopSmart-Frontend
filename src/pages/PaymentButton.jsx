import React from "react";

const PaymentButton = ({ amount }) => {
  const API = import.meta.env.VITE_BACKEND_API;

  const handlePayment = async () => {
    const response = await fetch(`${API}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const order = await response.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Shop Smart",
      description: "Test transaction",
      handler: (res) => {
        alert("Payment successful, ID:" + res.razorpay_payment_id);
      },
      theme: { color: "#3399cc" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay ₹{amount / 100}</button>
    </div>
  );
};

export default PaymentButton;
