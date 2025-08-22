import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Minus, ShoppingCart, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menu");
      setMenuItems(response.data);
    } catch (error) {
      setError("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const placeOrder = async () => {
    const items = Object.entries(cart)
      .filter(([_, quantity]) => quantity > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId, quantity }));

    if (items.length === 0) {
      alert("Please add items to cart");
      return;
    }

    try {
      await axios.post("/api/orders", { items });
      setCart({});
      alert("Order placed successfully!");
    } catch (error) {
      alert("Failed to place order");
    }
  };

  // Handle image loading errors
  const handleImageError = (itemId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Get image source with fallback options
  const getImageSrc = (item) => {
    if (imageLoadErrors[item._id]) return null;
    
    // Priority order for image sources
    if (item.image_url) return item.image_url;
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return item.image;
    
    return null;
  };

  // Placeholder component for missing images
  const ImagePlaceholder = ({ itemName }) => (
    <div className="w-full h-44 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm text-center px-4">{itemName}</span>
    </div>
  );

  const categories = [...new Set(menuItems.map((item) => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf3]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-b-[#b91c1c] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] flex flex-col items-center justify-start">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[#b91c1c] mb-3 tracking-wide">
            Our Menu
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 italic">
            "One cannot think well, love well, sleep well, if one has not dined well."
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Cart Summary */}
        {Object.values(cart).some((quantity) => quantity > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-4 z-10 mb-8 bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-[#b91c1c]" />
                <span className="text-lg font-semibold text-gray-900">
                  Cart ({Object.values(cart).reduce((sum, qty) => sum + qty, 0)} items)
                </span>
              </div>
              <button
                onClick={placeOrder}
                className="px-5 py-2 rounded-lg bg-[#b91c1c] text-white font-semibold hover:bg-[#7f1d1d] transition-colors"
              >
                Place Order
              </button>
            </div>
          </motion.div>
        )}

        {/* Menu Items by Category */}
        {categories.map((category, index) => (
          <div key={category} className="mb-12 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-[#1f2937] mb-6 capitalize border-b-2 border-[#eab308] inline-block pb-1"
            >
              {category}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter((item) => item.category === category)
                .map((item, i) => {
                  const imageSrc = getImageSrc(item);
                  
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
                    >
                      {/* Enhanced Image Handling */}
                      {imageSrc ? (
                        <div className="relative overflow-hidden">
                          <img
                            src={imageSrc}
                            alt={item.name}
                            className="w-full h-44 sm:h-56 object-cover hover:scale-105 transition-transform duration-300"
                            onError={() => handleImageError(item._id)}
                            loading="lazy"
                          />
                          {/* Image overlay gradient for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <ImagePlaceholder itemName={item.name} />
                      )}
                      
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#b91c1c]">
                            ₹{item.price.toFixed(2)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                              disabled={!cart[item._id]}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {cart[item._id] || 0}
                            </span>
                            <button
                              onClick={() => addToCart(item._id)}
                              className="w-8 h-8 rounded-full bg-[#b91c1c] text-white flex items-center justify-center hover:bg-[#7f1d1d] transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Extra Food Quote at Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 text-xl italic text-gray-700"
        >
          "Good food is the foundation of genuine happiness."
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;