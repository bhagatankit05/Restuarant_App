import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';
import connectDB from './config/database.js';

dotenv.config();

const sampleMenuItems = [
  {
    name: "Classic Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on a crispy crust",
    price: 14.99,
    category: "mains",
    imageUrl: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg"
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan cheese and croutons",
    price: 9.99,
    category: "salads",
    imageUrl: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg"
  },
  {
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon herb seasoning",
    price: 22.99,
    category: "mains",
    imageUrl: "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg"
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla ice cream",
    price: 7.99,
    category: "desserts",
    imageUrl: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg"
  },
  {
    name: "Chicken Wings",
    description: "Crispy buffalo wings served with celery and blue cheese",
    price: 11.99,
    category: "appetizers",
    imageUrl: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
  },
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 4.99,
    category: "beverages",
    imageUrl: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg"
  },
  {
    name: "Tomato Basil Soup",
    description: "Creamy tomato soup with fresh basil and herbs",
    price: 6.99,
    category: "soups",
    imageUrl: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg"
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 16.99,
    category: "mains",
    imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    await MenuItem.insertMany(sampleMenuItems);
    console.log('Sample menu items inserted successfully');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();