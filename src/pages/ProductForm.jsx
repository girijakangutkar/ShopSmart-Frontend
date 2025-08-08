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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/wareHouse/getProduct/${productId}`,
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
      ? `http://localhost:3000/wareHouse/editProduct/${productId}`
      : `http://localhost:3000/wareHouse/addProduct`;

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

  if (loading) {
    return <div className="mt-[5%]">Loading...</div>;
  }

  return (
    <div className="mt-[5%]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col border-1 border-slate-400 shadow-sm p-6 absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-45%] justify-center items-center text-left align-left w-[80%] sm:[80%] md:w-[40%] xl:[w-25%] 2xl:w-[25%]"
      >
        <h3 className="font-semibold text-[18px] text-gray-600 text-left w-full mb-3">
          Product Info
        </h3>
        {errMsg && (
          <p className="text-sm text-red-600 text-left w-full mb-2">{errMsg}</p>
        )}

        <label htmlFor="productName" className="text-gray-700 text-left w-full">
          Product Name *
        </label>
        <input
          name="productName"
          type="text"
          value={product.productName ?? ""}
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          placeholder="Product name"
          required
        />

        <label
          htmlFor="productCompany"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Product Company
        </label>
        <input
          name="productCompany"
          type="text"
          value={product.productCompany ?? ""}
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          placeholder="Product company"
        />

        <label
          htmlFor="productPrice"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Product Price *
        </label>
        <input
          name="productPrice"
          type="number"
          value={product.productPrice ?? ""}
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          placeholder="Product price"
          required
        />

        <label
          htmlFor="AvailableOptions"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Available Options
        </label>
        <input
          name="AvailableOptions"
          type="text"
          value={product.AvailableOptions ?? ""}
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          placeholder="Product options"
        />

        <label
          htmlFor="stock"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Product Stock
        </label>
        <input
          name="stock"
          type="number"
          value={product.stock ?? ""}
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          placeholder="Stock"
        />

        <label
          htmlFor="category"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Product Category
        </label>
        <input
          name="category"
          type="text"
          value={product.category ?? ""}
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          placeholder="Product Category"
        />

        <label
          htmlFor="productImage"
          className="text-gray-700 text-left w-full mt-2 mb-2"
        >
          Product Image *
        </label>
        <input
          name="productImage"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="border border-[#ccc] w-full shadow-md p-1.5 text-md text-gray-700 text-sm mb-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 w-full m-4 p-2 shadow-md text-white font-bold text-md"
        >
          {loading ? "Adding..." : "Add product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
