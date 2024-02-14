const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Connect to Database
connectDB().then(() => {
  // Seed initial data once DB is connected
  seedData();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Simple Status Route
app.get('/', (req, res) => {
  res.json({ message: 'BookEase API is running...' });
});

// Seed Data function
const User = require('./models/User');
const Service = require('./models/Service');

const seedData = async () => {
  try {
    // 1. Seed Admin
    const adminExists = await User.findOne({ email: 'admin@bookease.com' });
    if (!adminExists) {
      console.log('No admin found. Seeding default admin user...');
      await User.create({
        name: 'BookEase Admin',
        email: 'admin@bookease.com',
        password: 'admin123', // Will be hashed via pre-save model hook
        businessName: 'BookEase Salon',
        businessType: 'Salon',
        phone: '+1 (555) 019-2834',
        isAdmin: true
      });
      console.log('Default admin user seeded successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('No services found. Seeding default services...');
      const defaultServices = [
        { name: 'Haircut', duration: 45, price: 15, description: 'Classic haircut, wash and style.' },
        { name: 'Beard Trim', duration: 30, price: 10, description: 'Precision beard shaping and hot towel finish.' },
        { name: 'Hair + Beard Combo', duration: 60, price: 22, description: 'Combination package of haircut and beard grooming.' },
        { name: 'Hair Design', duration: 90, price: 25, description: 'Custom hair design, patterns, and creative styling.' },
        { name: 'Kids Haircut', duration: 30, price: 12, description: 'Quick and patient haircut for kids under 12.' }
      ];
      await Service.insertMany(defaultServices);
      console.log('Default services seeded successfully.');
    } else {
      console.log('Services already present in database.');
    }
  } catch (error) {
    console.error('Data seeding error:', error.message);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
