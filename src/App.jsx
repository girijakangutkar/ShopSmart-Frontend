import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NavBar from "./components/NavBar";
import UserSignup from "./authentication/UserSignup";
import Login from "./authentication/Login";
import ForgotPassword from "./authentication/ForgotPassword";
import ResetPassword from "./authentication/ResetPassword";
import Cart from "./pages/Cart";
import ProductForm from "./pages/ProductForm";
import OrderHistory from "./pages/OrderHistory";
import UserProfile from "./pages/UserProfile";
import ProductDetails from "./pages/ProductDetails";
import WishList from "./pages/WishList";
import NotFound from "./components/NotFound";
import PaymentCheckout from "./pages/PaymentCheckout";

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/api/resetPassword" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/addProduct" element={<ProductForm />} />
        <Route path="/orderHistory" element={<OrderHistory />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/editProduct/:productId" element={<ProductForm />} />
        <Route path="/productDetails/:productId" element={<ProductDetails />} />
        <Route path="/wishList" element={<WishList />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/paymentCheckout" element={<PaymentCheckout />} />
      </Routes>
    </div>
  );
};

export default App;
