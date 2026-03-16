require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ CORS is imported here
const { connectDB, sequelize } = require('./config/db');

// --- 1. IMPORT MODELS ---
const User = require('./models/User');
const AccessLog = require('./models/AccessLog');
const Book = require('./models/Book');
const LibraryTransaction = require('./models/LibraryTransaction');

// --- 2. IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const nfcRoutes = require('./routes/nfcRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const bleRoutes = require('./routes/bleRoutes');

const app = express();

connectDB();

// ✅ CORS and JSON middleware must go here, BEFORE the routes
app.use(cors());
app.use(express.json());

// --- 3. REGISTER ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/ble', bleRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced & Library Tables Created');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Database Sync Error:', err);
    }
};

startServer();