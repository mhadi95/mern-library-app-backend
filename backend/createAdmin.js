const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://hadimuhammad140:POcfffPL2NT0mRQv@mern-library-testing-cl.zg660up.mongodb.net/?retryWrites=true&w=majority&appName=mern-library-testing-cluster';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@library.com',
      password: 'admin123',
      role: 'admin',
      phone: '123-456-7890',
      address: '123 Admin Street, Admin City'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin user already exists!');
      console.log('Email: admin@library.com');
      console.log('Password: admin123');
    } else {
      console.error('Error creating admin user:', error);
    }
    process.exit(1);
  }
}

createAdmin();
