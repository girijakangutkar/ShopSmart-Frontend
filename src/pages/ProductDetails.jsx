import axios from "axios";
import { ArrowLeft, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const [productData, setProductData] = useState(null);
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    if (productId) {
      handleProductDetails(productId);
    }
  }, [productId]);

  const handleProductDetails = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API}/wareHouse/productDetails/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProductData(response.data.product);
      // console.log("Product detail fetched successfully", response);
      setError(null);
    } catch (error) {
      console.log("Something went wrong", error);
      setError("Failed to fetch product details.");
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? "text-yellow-500" : "text-gray-300"}
      >
        <Star />
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="mt-[5%] flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[5%] flex justify-center items-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-[5%] max-w-6xl mx-auto p-4">
      <button
        onClick={() => navigate("/")}
        className="flex flex-row gap-3 mb-4 text-bold text-gray-800"
      >
        <ArrowLeft /> Back
      </button>
      {productData ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Product Main Info */}
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-1/2 p-6 items-center content-center align-center self-center">
              <img
                src={productData.productImage}
                alt={productData.productName}
                className="w-full h-auto object-cover rounded-lg shadow-md"
                style={{ width: "400px", height: "300px" }}
              />
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {productData.productName}
              </h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-32">
                    Price:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{productData.productPrice}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-32">
                    Company:
                  </span>
                  <span className="text-lg">{productData.productCompany}</span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-32">
                    Stock:
                  </span>
                  <span
                    className={`text-lg ${
                      productData.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {productData.stock > 0 ? `Available` : "Out of Stock"}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-600 w-32">
                    Category:
                  </span>
                  <span className="text-lg capitalize">
                    {productData.category}
                  </span>
                </div>
              </div>

              {/* Available Options */}
              {productData.AvailableOptions &&
                productData.AvailableOptions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-600 mb-2">
                      Available Options:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {productData.AvailableOptions.map((option, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Customer Reviews ({productData.review.length})
            </h2>

            {productData.review.length > 0 ? (
              <div className="space-y-4">
                {productData.review.map((review, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start space-x-4">
                      {/* User Profile Photo */}
                      <div className="flex-shrink-0">
                        {review.ratedBy?.profilePhoto ? (
                          <img
                            src={review.ratedBy.profilePhoto}
                            alt={review.ratedBy.name || "User"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                            {review.ratedBy?.name
                              ? review.ratedBy.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {review.ratedBy?.name || "Anonymous User"}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.feedbackDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center mb-2">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">
                            ({review.rating}/5)
                          </span>
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-700 leading-relaxed">
                          {review.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No reviews yet.</p>
                <p className="text-gray-400">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-xl text-gray-600">No product data available.</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
