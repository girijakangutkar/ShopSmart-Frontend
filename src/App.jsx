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
      </Routes>
    </div>
  );
};

export default App;
