import express from 'express';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.menuItem', 'name description imageUrl')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get specific order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    }).populate('items.menuItem', 'name description imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body; // [{ menuItemId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.menuItemId}` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item not available: ${menuItem.name}` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      status: 'pending'
    });

    await order.save();
    await order.populate('items.menuItem', 'name description imageUrl');

    res.status(201).json({ 
      message: 'Order created successfully', 
      order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status },
      { new: true }
    ).populate('items.menuItem', 'name description imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Update order item quantity
router.put('/:orderId/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot modify confirmed orders' });
    }

    const itemIndex = order.items.findIndex(item => 
      item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    // Update quantity and recalculate total
    order.items[itemIndex].quantity = quantity;
    
    let newTotal = 0;
    order.items.forEach(item => {
      newTotal += item.price * item.quantity;
    });
    order.totalAmount = newTotal;

    await order.save();
    await order.populate('items.menuItem', 'name description imageUrl');

    res.json(order);
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ message: 'Error updating order item' });
  }
});

// Delete order item
router.delete('/:orderId/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      user: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot modify confirmed orders' });
    }

    const itemIndex = order.items.findIndex(item => 
      item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    order.items.splice(itemIndex, 1);
    
    if (order.items.length === 0) {
      await Order.findByIdAndDelete(order._id);
      return res.json({ message: 'Order deleted (no items remaining)' });
    }

    let newTotal = 0;
    order.items.forEach(item => {
      newTotal += item.price * item.quantity;
    });
    order.totalAmount = newTotal;

    await order.save();
    await order.populate('items.menuItem', 'name description imageUrl');

    res.json(order);
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ message: 'Error deleting order item' });
  }
});

// Delete entire order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

export default router;