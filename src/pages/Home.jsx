import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortOrder: "asc",
  });

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    debounceFetch();
    return () => debounceFetch.cancel();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(
        `http://localhost:3000/wareHouse/products?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(response.data.productData);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const debounceFetch = useMemo(() => debounce(fetchProducts, 300), [filters]);

  const handleCart = async (productId) => {
    try {
      const info = await axios.put(
        `http://localhost:3000/myInfo/addToCart/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Added to the cart`);
      console.log("Added to the cart", info);
    } catch (error) {
      console.log("Something went wrong while adding to cart");
    }
  };

  const handleOrder = async (productId) => {
    try {
      const info = await axios.put(
        `http://localhost:3000/myInfo/orderThis/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order is being process");
      console.log("Order is being process", info);
    } catch (error) {
      console.log("Something went wrong while ordering");
    }
  };

  return (
    <div className="flex flex-row mt-[3%]">
      <div className="w-[20%]">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border p-2 mr-2"
        />
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="border p-2 mr-2"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
        <input
          type="number"
          value={filters.minPrice}
          placeholder="Min Price"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
          }
          className="border p-2 mr-2"
        />
        <input
          value={filters.maxPrice}
          type="number"
          placeholder="Max Price"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
          className="border p-2 mr-2"
        />
        <select
          value={filters.sortOrder}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))
          }
          className="border p-2"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <div className="p-6 w-[80%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-[#ccc] shadow p-4 hover:shadow-lg transition"
            >
              <img
                src={item.productImage}
                alt={item.productName}
                width={"200px"}
                height={"350px"}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-600">₹{item.productPrice}</p>
              <p className="text-xs text-gray-500 mt-1">
                {item.productCompany}
              </p>
              <div className="flex flex-row w-full justify-between">
                <button
                  className="mt-2 px-4 py-2 bg-slate-500 text-sm text-white rounded hover:bg-blue-600"
                  onClick={() => handleCart(item._id)}
                >
                  Add to cart
                </button>
                <button
                  className="mt-2 ml-2 px-4 py-2 bg-slate-600 text-sm text-white rounded hover:bg-green-600"
                  onClick={() => handleOrder(item._id)}
                >
                  Buy now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
