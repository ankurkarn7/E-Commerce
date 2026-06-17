// Local development launcher: spins up an in-memory MongoDB so the app can
// run without any MongoDB installed. Data is reset every restart.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function seed() {
    const User = require('./models/userModel');
    const Product = require('./models/productModel');

    if (await User.countDocuments() > 0) return;   // already seeded this run

    const password = await bcrypt.hash('password123', 10);
    const seller = await User.create({ name: 'Demo Seller', email: 'seller@demo.com', password, role: 'seller' });
    await User.create({ name: 'Demo Buyer', email: 'buyer@demo.com', password, role: 'user' });

    await Product.insertMany([
        { name: 'Wireless Headphones', price: 1999, count: 10, sellerId: seller._id },
        { name: 'Mechanical Keyboard', price: 3499, count: 5, sellerId: seller._id },
        { name: 'USB-C Charger', price: 799, count: 0, sellerId: seller._id },
        { name: 'Laptop Stand', price: 1299, count: 8, sellerId: seller._id },
    ]);

    console.log('\nSeeded demo data. Login with:');
    console.log('  Seller -> seller@demo.com / password123');
    console.log('  Buyer  -> buyer@demo.com  / password123\n');
}

async function start() {
    const mongo = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongo.getUri();
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

    console.log('In-memory MongoDB started at', process.env.MONGO_URI);

    mongoose.connection.once('connected', () => {
        seed().catch(err => console.error('Seed error:', err));
    });

    require('./app');   // connects to MONGO_URI and starts the server

    const shutdown = async () => {
        await mongoose.disconnect().catch(() => {});
        await mongo.stop().catch(() => {});
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

start().catch(err => {
    console.error('Failed to start dev server:', err);
    process.exit(1);
});
