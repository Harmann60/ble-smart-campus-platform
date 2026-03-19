require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
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

// Database Connection
connectDB();

// ✅ Middleware (MUST be before routes)
app.use(cors());
app.use(express.json());

// --- 3. REGISTER ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/ble', bleRoutes);

const PORT = process.env.PORT || 5000;

// --- 4. DEMO REGISTRATION FUNCTION (SEEDING) ---
const registerDemoStudents = async () => {
    try {
        // Mapping Jalaj's phone MAC
        await User.findOrCreate({
            where: { ble_mac: "06:1F:02:B9:4D:D3" }, 
            defaults: {
                name: "Jalaj",
                email: "jalaj@campus.edu",
                role: "student",
                engagement_score: 100
            }
        });

        // Mapping Harman's phone MAC
        await User.findOrCreate({
            where: { ble_mac: "4E:A1:22:98:B5:C0" }, 
            defaults: {
                name: "Harman",
                email: "harman@campus.edu",
                role: "student",
                engagement_score: 95
            }
        });
        
        console.log("✅ Demo Students Synced to Database");
    } catch (err) {
        console.log("⚠️ Seeding note:", err.message);
    }
};

// --- 5. START SERVER ---
const startServer = async () => {
    try {
        // Sync database structure
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced & Library Tables Created');

        // Run the demo mapping
        await registerDemoStudents();

        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 ESP32 should send data to: http://[YOUR_IP]:${PORT}/api/ble/telemetry`);
        });
    } catch (err) {
        console.error('❌ Database Sync Error:', err);
    }
};

startServer();