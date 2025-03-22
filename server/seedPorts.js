const mongoose = require('mongoose');
const Port = require('./Models/Port');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/oracle_main', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  seedPorts();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const ports = [
  {
    country: 'India',
    ports: [
      'Cochin',
      'Mumbai',
      'Chennai',
      'Kolkata',
      'Visakhapatnam',
      'Kandla',
      'Tuticorin',
      'Paradip',
      'Mangalore',
      'Ennore'
    ]
  },
  {
    country: 'China',
    ports: [
      'Shanghai',
      'Guangzhou',
      'Ningbo',
      'Shenzhen',
      'Qingdao',
      'Tianjin',
      'Dalian',
      'Xiamen',
      'Yingkou',
      'Lianyungang'
    ]
  },
  {
    country: 'Singapore',
    ports: ['Singapore']
  },
  {
    country: 'Japan',
    ports: [
      'Tokyo',
      'Yokohama',
      'Nagoya',
      'Osaka',
      'Kobe',
      'Chiba'
    ]
  },
  {
    country: 'United States',
    ports: [
      'Los Angeles',
      'Long Beach',
      'New York',
      'Savannah',
      'Houston',
      'Norfolk',
      'Seattle',
      'Oakland',
      'Charleston',
      'Miami'
    ]
  },
  {
    country: 'United Arab Emirates',
    ports: [
      'Dubai',
      'Jebel Ali',
      'Abu Dhabi',
      'Sharjah',
      'Khalifa'
    ]
  }
];

async function seedPorts() {
  try {
    // Clear existing data
    await Port.deleteMany({});
    console.log('Deleted existing port data');

    // Insert new port data
    const result = await Port.insertMany(ports);
    console.log(`Added ${result.length} country port entries`);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding ports:', error);
    mongoose.disconnect();
  }
} 