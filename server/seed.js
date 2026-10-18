import mongoose from 'mongoose';
import Product from './models/Product.js';

const products = [
    {
        name: "Kemeja Flanel Pria",
        price: 150000,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60",
        description: "Kemeja flanel berkualitas tinggi, nyaman dipakai."
    },
    {
        name: "Celana Jeans Slim Fit",
        price: 250000,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
        description: "Celana jeans slim fit cocok untuk berbagai acara."
    },
    {
        name: "Sepatu Sneakers Putih",
        price: 300000,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60",
        description: "Sneakers putih klasik, ringan dan nyaman."
    },
    {
        name: "Kaos Polos Katun Bambu",
        price: 75000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
        description: "Kaos polos dari katun bambu asli."
    }
];

mongoose.connect('mongodb://127.0.0.1:27017/online_shop')
    .then(async () => {
        console.log('Connected to MongoDB');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Database seeded!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
