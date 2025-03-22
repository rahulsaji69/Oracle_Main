const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createTruckingUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'trucking@gmail.com' });
    
    if (existingUser) {
      console.log('Trucking user already exists');
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Truck@123', salt);

    // Create the trucking user
    const truckingUser = new User({
      firstName: 'Trucking',
      lastName: 'Admin',
      email: 'trucking@gmail.com',
      password: hashedPassword,
      company: 'Trucking Services',
      street: '123 Truck Lane',
      postalCode: '12345',
      city: 'Transport City',
      state: 'Transport State',
      country: 'India',
      phone: '1234567890',
      role: 'trucking', // Set the role to 'trucking'
      status: 'enabled'
    });

    await truckingUser.save();
    console.log('Trucking user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating trucking user:', error);
    process.exit(1);
  }
};

createTruckingUser(); 