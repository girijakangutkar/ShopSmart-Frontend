import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductForm = () => {
  const [product, setProduct] = useState({
    productName: "",
    productCompany: "",
    productPrice: "",
    AvailableOptions: "",
    category: "",
    productImage: null,
    stock: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { productId } = useParams();
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/wareHouse/getProduct/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.product;

        setProduct({
          productName: data.productName,
          productCompany: data.productCompany,
          productPrice: data.productPrice,
          AvailableOptions: data.AvailableOptions.join(", "),
          category: data.category,
          productImage: null,
          stock: data.stock,
        });
      } catch (error) {
        console.error("Error fetching product", error);
        setErrMsg("Failed to load product data");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    try {
      const { name, files, value } = e.target;

      setProduct((prevData) => ({
        ...prevData,
        [name]: name === "productImage" ? files[0] : value,
      }));
    } catch (error) {
      console.log("Error occurred in handleChange:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    const endPoint = productId
      ? `${API}/wareHouse/editProduct/${productId}`
      : `${API}/wareHouse/addProduct`;

    const method = productId ? "put" : "post";

    if (
      !product.productName ||
      !product.productPrice ||
      !product.productImage
    ) {
      setErrMsg("Please fill in all required fields (Name, Price, and Image)");
      return;
    }

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productCompany", product.productCompany);
    formData.append("AvailableOptions", product.AvailableOptions);
    formData.append("stock", product.stock);
    formData.append("productImage", product.productImage);
    formData.append("category", product.category);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const info = await axios[method](endPoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Product added", info.data);
      alert("Product added successfully!");

      // Reset form with consistent data types
      setProduct({
        productName: "",
        productCompany: "",
        productPrice: "",
        AvailableOptions: "",
        category: "",
        productImage: null,
        stock: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      setErrMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return <div className="mt-[5%]">Loading...</div>;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 mt-[4%]">
      {/* Loading State */}
      {loading ? (
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Processing your request...
          </p>
        </div>
      ) : (
        /* Form */
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              Product Information
            </h3>
            <p className="text-sm text-gray-500">
              Fields marked with * are required
            </p>
          </div>

          {errMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errMsg}
            </div>
          )}

          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                name="productName"
                type="text"
                value={product.productName ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Product Company */}
            <div>
              <label
                htmlFor="productCompany"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Company
              </label>
              <input
                name="productCompany"
                type="text"
                value={product.productCompany ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter company name"
              />
            </div>

            {/* Product Price */}
            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  name="productPrice"
                  type="number"
                  value={product.productPrice ?? ""}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Available Options */}
            <div>
              <label
                htmlFor="AvailableOptions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available Options
              </label>
              <input
                name="AvailableOptions"
                type="text"
                value={product.AvailableOptions ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Color, Size, etc."
              />
            </div>

            {/* Product Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Stock
              </label>
              <input
                name="stock"
                type="number"
                value={product.stock ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter quantity"
              />
            </div>

            {/* Product Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Category
              </label>
              <select
                name="category"
                value={product.category ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Kitchen</option>
                <option value="books">Books</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>

            {/* Product Image */}
            <div>
              <label
                htmlFor="productImage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Image *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                  <div className="p-4 text-center">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    name="productImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
