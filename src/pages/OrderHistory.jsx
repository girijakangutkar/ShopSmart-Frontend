import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";
import {
  Star,
  Calendar,
  MessageCircle,
  Package,
  Building2,
  Hash,
} from "lucide-react";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [feedback, setFeedback] = useState({
    rating: 0,
    feedback: "",
  });
  const { user } = useContext(authContext);
  const [reviewingProductId, setReviewingProductId] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/myInfo/orderHistory`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrderHistory(response.data.orderHistory);
      console.log(response.data.orderHistory);
    } catch (error) {
      console.error("Error while fetching order history");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleReview = async (productId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/myInfo/addRatingAndReview/${productId}`,
        { review: feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Reviewing product ID:", productId);
      console.log("Review payload:", feedback);

      console.log("Review added", response);
      fetchOrderHistory();
      setReviewingProductId(null);
      setFeedback({ rating: 0, feedback: "" });
    } catch (error) {
      console.log("Something went wrong while giving review", error);
    }
  };

  const orderedItems = orderHistory.filter((item) => item.product);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-[4%]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
        <p className="text-gray-600">Track and review your recent purchases</p>
      </div>

      <div className="space-y-6">
        {orderedItems.map((item) => {
          const userReview = item.product.review.find((r) => {
            const ratedById =
              typeof r.ratedBy === "string"
                ? r.ratedBy
                : r.ratedBy?._id || r.ratedBy?.toString();
            return ratedById === user.userId;
          });

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-full lg:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.product.productImage || "/placeholder.svg"}
                        alt={item.product.productName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.product.productName}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium text-2xl text-green-600">
                            {item.product.productPrice}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{item.product.productCompany}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Hash className="w-4 h-4" />
                          <span>Qty: {item.product.quantity}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">
                            {formatDate(item.purchasedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Section */}
                    <div className="border-t pt-4">
                      {userReview ? (
                        <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Your Review
                            </h4>
                            <div className="flex items-center gap-1">
                              {renderStars(userReview.rating)}
                            </div>
                          </div>

                          <p className="text-gray-700 italic">
                            "{userReview.feedback}"
                          </p>

                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Reviewed on {formatDate(userReview.feedbackDate)}
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setReviewingProductId(item.product._id)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          <Star className="w-4 h-4" />
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Form Modal */}
      {reviewingProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Write Your Review
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReview(reviewingProductId);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    name="rating"
                    min="1"
                    max="5"
                    value={feedback.rating}
                    onChange={handleChange}
                    className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-1 min-w-[100px]">
                    {renderStars(feedback.rating)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  name="feedback"
                  value={feedback.feedback}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Share your experience with this product..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setReviewingProductId(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
