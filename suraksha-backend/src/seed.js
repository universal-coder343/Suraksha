const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Zone = require('./models/Zone');
const PoliceStation = require('./models/PoliceStation');

dotenv.config();

const jaipurZones = [
  // RED ZONES
  {
    city: 'Jaipur',
    name: 'Mansarovar',
    risk: 'red',
    weight: 10,
    polygon: [
      [26.8621, 75.7551],
      [26.8421, 75.7551],
      [26.8421, 75.7751],
      [26.8621, 75.7751]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Sanganer',
    risk: 'red',
    weight: 10,
    polygon: [
      [26.8120, 75.7900],
      [26.7920, 75.7900],
      [26.7920, 75.8100],
      [26.8120, 75.8100]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Jagatpura',
    risk: 'red',
    weight: 10,
    polygon: [
      [26.8288, 75.8543],
      [26.8088, 75.8543],
      [26.8088, 75.8743],
      [26.8288, 75.8743]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Vaishali Nagar',
    risk: 'red',
    weight: 10,
    polygon: [
      [26.9179, 75.7269],
      [26.8979, 75.7269],
      [26.8979, 75.7469],
      [26.9179, 75.7469]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Jhotwara',
    risk: 'red',
    weight: 10,
    polygon: [
      [26.9527, 75.7246],
      [26.9327, 75.7246],
      [26.9327, 75.7446],
      [26.9527, 75.7446]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Walled City (Johari Bazaar)',
    risk: 'red',
    weight: 10,
    polygon: [
      [26.9300, 75.8100],
      [26.9100, 75.8100],
      [26.9100, 75.8300],
      [26.9300, 75.8300]
    ]
  },
  // YELLOW ZONES
  {
    city: 'Jaipur',
    name: 'Malviya Nagar',
    risk: 'yellow',
    weight: 3,
    polygon: [
      [26.8649, 75.8143],
      [26.8449, 75.8143],
      [26.8449, 75.8343],
      [26.8649, 75.8343]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Tonk Road',
    risk: 'yellow',
    weight: 3,
    polygon: [
      [26.8500, 75.7800],
      [26.8300, 75.7800],
      [26.8300, 75.8000],
      [26.8500, 75.8000]
    ]
  },
  {
    city: 'Jaipur',
    name: 'Raja Park',
    risk: 'yellow',
    weight: 3,
    polygon: [
      [26.9050, 75.8150],
      [26.8850, 75.8150],
      [26.8850, 75.8350],
      [26.9050, 75.8350]
    ]
  },
  // GREEN ZONES
  {
    city: 'Jaipur',
    name: 'Civil Lines',
    risk: 'green',
    weight: 0,
    polygon: [
      [26.9145, 75.7800],
      [26.8945, 75.7800],
      [26.8945, 75.8000],
      [26.9145, 75.8000]
    ]
  },
  {
    city: 'Jaipur',
    name: 'C-Scheme',
    risk: 'green',
    weight: 0,
    polygon: [
      [26.9200, 75.7900],
      [26.9000, 75.7900],
      [26.9000, 75.8100],
      [26.9200, 75.8100]
    ]
  }
];

const policeStations = [
  {
    name: 'Mansarovar Police Station',
    phone: '0141-2555555',
    city: 'Jaipur',
    location: { lat: 26.8521, lng: 75.7651 }
  },
  {
    name: 'Vaishali Nagar Police Station',
    phone: '0141-2555556',
    city: 'Jaipur',
    location: { lat: 26.9079, lng: 75.7369 }
  },
  {
    name: 'Jaipur City Police HQ',
    phone: '0141-2555557',
    city: 'Jaipur',
    location: { lat: 26.9200, lng: 75.8200 }
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/suraksha';
    await mongoose.connect(connStr);
    console.log('MongoDB connected for Jaipur seeding.');

    await Zone.deleteMany();
    await Zone.insertMany(jaipurZones);
    console.log('Jaipur Zones seeded.');

    await PoliceStation.deleteMany();
    await PoliceStation.insertMany(policeStations);
    console.log('Jaipur Police stations seeded.');

    await User.deleteMany();
    
    await User.create({
      name: 'Jaipur Test User',
      phone: '9876543210',
      password: 'user1234',
      role: 'user',
      city: 'Jaipur'
    });

    await User.create({
      name: 'Jaipur Police Dispatch',
      phone: '9876543211',
      password: 'police1234',
      role: 'police',
      city: 'Jaipur'
    });
    
    console.log('Jaipur Test users seeded.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Jaipur data:', error);
    process.exit(1);
  }
};

seedDB();
