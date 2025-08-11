import React, { useState, useEffect, useContext } from "react";
import {
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  X,
  RefreshCw,
  Star,
  Calendar,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import { authContext } from "../context/AuthContext";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [feedback, setFeedback] = useState({
    rating: 1,
    feedback: "",
  });
  const { user } = useContext(authContext);
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const API = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/myInfo/orderHistory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Fetch detailed product info for each order to get reviews
      const ordersWithReviews = await Promise.all(
        (response.data.orderHistory || []).map(async (order) => {
          try {
            const productResponse = await axios.get(
              `${API}/wareHouse/productDetails/${order.product._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            return {
              ...order,
              product: {
                ...order.product,
                review: productResponse.data.product.review || [],
              },
            };
          } catch (error) {
            console.error("Error fetching product details:", error);
            return {
              ...order,
              product: {
                ...order.product,
                review: [],
              },
            };
          }
        })
      );

      setOrders(ordersWithReviews);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
  };

  const handleReview = async (productId) => {
    try {
      const response = await axios.patch(
        `${API}/myInfo/addRatingAndReview/${productId}`,
        { review: feedback },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Refresh orders to get updated review data
      await fetchOrders();
      setReviewingProductId(null);
      setFeedback({ rating: 1, feedback: "" });
    } catch (error) {
      console.log("Something went wrong while giving review", error);
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "processing":
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus === filter;
  });

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await axios.put(
          `${API}/myInfo/cancelOrder/${orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          fetchOrders();
          alert("Order cancelled successfully");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Error cancelling order");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-[4%]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 mr-2" />
              Order History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} placed
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (
              orders.map((order) => {
                // Find the logged-in user's review for this product
                // Changed from order.product?.reviews to order.product?.review
                const userReview = order.product?.review?.find((review) => {
                  // Handle both string and object formats for ratedBy
                  const reviewerId =
                    typeof review.ratedBy === "string"
                      ? review.ratedBy
                      : review.ratedBy?._id;
                  return reviewerId === user.userId;
                });

                return (
                  <div key={order._id} className="px-6 py-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <img
                          src={order.product.productImage}
                          alt={order.product.productName}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 truncate">
                                {order.product.productName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Order ID: {order.orderId}
                              </p>
                              <p className="text-sm text-gray-500">
                                Ordered on{" "}
                                {new Date(
                                  order.purchasedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ₹{order.totalAmount}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {order.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                  order.orderStatus
                                )}`}
                              >
                                {getStatusIcon(order.orderStatus)}
                                <span className="ml-2 capitalize">
                                  {order.orderStatus}
                                </span>
                              </div>

                              <div className="flex items-center text-sm text-gray-500">
                                <CreditCard className="w-4 h-4 mr-1" />
                                {order.paymentMode === "online"
                                  ? "Paid Online"
                                  : "Cash on Delivery"}
                                {order.paymentStatus && (
                                  <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              {order.trackingId && (
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                                  Track Order
                                </button>
                              )}

                              {/* {order.orderStatus === "delivered" && (
                                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors">
                                  Reorder
                                </button>
                              )} */}

                              {["pending", "confirmed"].includes(
                                order.orderStatus
                              ) && (
                                <button
                                  onClick={() =>
                                    handleCancelOrder(order.orderId)
                                  }
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Review Section - Only for delivered orders */}
                          {order.orderStatus === "delivered" && (
                            <div className="mt-4 border-t pt-4">
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
                                    Reviewed on{" "}
                                    {formatDate(userReview.feedbackDate)}
                                  </p>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReviewingProductId(order.product._id)
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                  <Star className="w-4 h-4" />
                                  Write a Review
                                </button>
                              )}
                            </div>
                          )}

                          {order.deliveredAt && (
                            <div className="mt-2 text-sm text-green-600">
                              Delivered on{" "}
                              {new Date(order.deliveredAt).toLocaleDateString()}
                            </div>
                          )}

                          {order.paymentId && (
                            <div className="mt-2 text-xs text-gray-500">
                              Payment ID: {order.paymentId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
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
                  required
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
