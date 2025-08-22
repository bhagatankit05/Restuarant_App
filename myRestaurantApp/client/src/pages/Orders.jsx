import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Trash2, Edit, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrderItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item?")) return;

    try {
      const order = orders.find((o) =>
        o.items.some((item) => item._id === itemId)
      );
      if (order) {
        await axios.delete(`/api/orders/${order._id}/items/${itemId}`);
      }
      await fetchOrders();
    } catch (error) {
      alert("Failed to delete order item");
    }
  };

  const updateOrderItem = async (itemId) => {
    try {
      const order = orders.find((o) =>
        o.items.some((item) => item._id === itemId)
      );
      if (order) {
        await axios.put(`/api/orders/${order._id}/items/${itemId}`, {
          quantity: newQuantity,
        });
      }
      setEditingItem(null);
      await fetchOrders();
    } catch (error) {
      alert("Failed to update order item");
    }
  };

  const startEditing = (itemId, currentQuantity) => {
    setEditingItem(itemId);
    setNewQuantity(currentQuantity);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-red-700 mb-3">
            🍴 My Orders
          </h1>
          <p className="text-lg text-gray-700">
            Track and manage your delicious orders in real time
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white shadow-xl rounded-2xl max-w-lg mx-auto border border-gray-100"
          >
            <div className="text-gray-400 mb-4">
              <Clock className="w-14 h-14 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Start by browsing our menu and placing your first order!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <div className="text-2xl font-bold text-red-600 mt-2">
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {item.menuItem.imageUrl && (
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {item.menuItem.description}
                          </p>
                          <p className="text-sm font-medium text-red-600">
                            ₹{item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                        {editingItem === item._id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                setNewQuantity(Math.max(1, newQuantity - 1))
                              }
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {newQuantity}
                            </span>
                            <button
                              onClick={() => setNewQuantity(newQuantity + 1)}
                              className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateOrderItem(item._id)}
                              className="ml-2 px-3 py-1 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="font-medium">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Total: ₹
                              {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        )}

                        {order.status === "pending" &&
                          editingItem !== item._id && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  startEditing(item._id, item.quantity)
                                }
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteOrderItem(item._id)}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
