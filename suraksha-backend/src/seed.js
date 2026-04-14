const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Zone = require('./models/Zone');
const PoliceStation = require('./models/PoliceStation');

dotenv.config();

const bhopalZones = [
  {
    city: 'Bhopal',
    name: 'Govindpura Industrial Area',
    risk: 'red',
    weight: 10,
    polygon: [
      [23.2500, 77.4400],
      [23.2600, 77.4400],
      [23.2600, 77.4500],
      [23.2500, 77.4500]
    ]
  },
  {
    city: 'Bhopal',
    name: 'Habibganj',
    risk: 'yellow',
    weight: 3,
    polygon: [
      [23.2300, 77.4300],
      [23.2400, 77.4300],
      [23.2400, 77.4400],
      [23.2300, 77.4400]
    ]
  },
  {
    city: 'Bhopal',
    name: 'TT Nagar',
    risk: 'green',
    weight: 0,
    polygon: [
      [23.2350, 77.3950],
      [23.2450, 77.3950],
      [23.2450, 77.4050],
      [23.2350, 77.4050]
    ]
  },
  {
    city: 'Bhopal',
    name: 'MP Nagar',
    risk: 'green',
    weight: 0,
    polygon: [
      [23.2300, 77.4200],
      [23.2400, 77.4200],
      [23.2400, 77.4300],
      [23.2300, 77.4300]
    ]
  }
];

const policeStations = [
  {
    name: 'TT Nagar Police Station',
    phone: '0755-2555555',
    city: 'Bhopal',
    location: { lat: 23.2389, lng: 77.4025 },
    jurisdiction: []
  },
  {
    name: 'Habibganj Police Station',
    phone: '0755-2555556',
    city: 'Bhopal',
    location: { lat: 23.2350, lng: 77.4360 },
    jurisdiction: []
  },
  {
    name: 'Govindpura Police Station',
    phone: '0755-2555557',
    city: 'Bhopal',
    location: { lat: 23.2550, lng: 77.4450 },
    jurisdiction: []
  },
  {
    name: 'MP Nagar Police Station',
    phone: '0755-2555558',
    city: 'Bhopal',
    location: { lat: 23.2330, lng: 77.4250 },
    jurisdiction: []
  },
  {
    name: 'Bhopal Central Police',
    phone: '0755-2555559',
    city: 'Bhopal',
    location: { lat: 23.2599, lng: 77.4126 },
    jurisdiction: []
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/suraksha';
    await mongoose.connect(connStr);
    console.log('MongoDB connected for seeding.');

    await Zone.deleteMany();
    await Zone.insertMany(bhopalZones);
    console.log('Zones seeded.');

    await PoliceStation.deleteMany();
    await PoliceStation.insertMany(policeStations);
    console.log('Police stations seeded.');

    await User.deleteMany();
    
    await User.create({
      name: 'Test Setup User',
      phone: '9000000000',
      password: 'test1234', // hashed by pre-save
      role: 'user',
      city: 'Bhopal'
    });

    await User.create({
      name: 'Police HQ Dispatch',
      phone: '9000000001',
      password: 'police1234', // hashed by pre-save
      role: 'police',
      city: 'Bhopal'
    });
    
    console.log('Test users seeded.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
