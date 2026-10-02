const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini-ecommerce';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding.');

    // 1. Clear existing database collections
    console.log('Clearing existing database collections...');
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Database wiped cleanly.');

    // 2. Seed Users
    console.log('Seeding initial users...');
    const adminUser = await User.create({
      name: 'Store Admin',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Alex Customer',
      email: 'customer@ecommerce.com',
      password: 'customer123',
      role: 'customer',
    });
    console.log('👤 Created Admin (admin@ecommerce.com) and Customer (customer@ecommerce.com).');

    // 3. Seed Categories
    console.log('Seeding categories...');
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Gadgets, smartphones, audio devices, and accessories',
      },
      {
        name: 'Fashion',
        description: 'Apparel, denim jackets, hoodies, and streetwear',
      },
      {
        name: 'Shoes',
        description: 'Athletic running sneakers, casual shoes, and athletic footwear',
      },
    ]);
    console.log(`📁 Created ${categories.length} categories.`);

    const electronicsId = categories.find((c) => c.name === 'Electronics')._id;
    const fashionId = categories.find((c) => c.name === 'Fashion')._id;
    const shoesId = categories.find((c) => c.name === 'Shoes')._id;

    // 4. Seed Products
    console.log('Seeding products...');
    const products = [
      {
        name: 'Smart Phone Pro',
        description: 'High-performance AMOLED smartphone with 128GB storage and ultra-clear 50MP camera.',
        price: 699.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
        category: electronicsId,
        stock: 15,
      },
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Premium over-ear headphones with 30-hour battery life and studio-grade audio.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
        category: electronicsId,
        stock: 25,
      },
      {
        name: 'Fitness Smart Watch V2',
        description: 'Waterproof activity tracker with AMOLED display, heart rate monitor, and GPS.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
        category: electronicsId,
        stock: 12,
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless vintage wash denim jacket made from 100% durable cotton.',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop',
        category: fashionId,
        stock: 20,
      },
      {
        name: 'Minimalist Cotton Hoodie',
        description: 'Heavyweight organic cotton pullover hoodie for everyday comfort and warmth.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop',
        category: fashionId,
        stock: 30,
      },
      {
        name: 'Vintage Casual Tee',
        description: 'Soft combed cotton t-shirt with classic relaxed fit and reinforced crew neckline.',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop',
        category: fashionId,
        stock: 50,
      },
      {
        name: 'Pro Running Trainers',
        description: 'Lightweight breathable mesh athletic sneakers with shock-absorbing foam sole.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
        category: shoesId,
        stock: 18,
      },
      {
        name: 'Streetwear High-Tops',
        description: 'Iconic urban high-top sneakers with cushioned ankle collar and rubber traction sole.',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop',
        category: shoesId,
        stock: 10,
      },
      {
        name: 'Classic White Sneakers',
        description: 'Versatile low-top leather sneakers with clean minimalist profile.',
        price: 65.0,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop',
        category: shoesId,
        stock: 22,
      },
    ];

    await Product.insertMany(products);
    console.log(`📦 Created ${products.length} products with stock and images.`);

    console.log('\n🎉 Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    process.exit(1);
  }
};

seedData();
