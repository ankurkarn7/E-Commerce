const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const sellerRoutes = require('./routes/sellerRoutes');
app.use('/seller', sellerRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/cart', cartRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/product', productRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/order/', orderRoutes);

app.get('/', (req, res)=>{
    res.send("hello ankur karn, you can start building e commerce website now.");
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});