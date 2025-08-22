import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isAvailable: true })
      .sort({ createdAt: -1 });

    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Error fetching menu item' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category: category.toLowerCase(),
      imageUrl,
      isAvailable: true
    });

    await menuItem.save();

    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Error creating menu item' });
  }
});

// Update 
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category: category?.toLowerCase(),
        imageUrl,
        isAvailable
      },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
});

// Delete menu item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

export default router;