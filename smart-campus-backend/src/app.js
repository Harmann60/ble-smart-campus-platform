require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// CSV IMPORT
const fs = require('fs');
const csv = require('csv-parser');

// --- 1. IMPORT MODELS ---
const User = require('./models/User');
const AccessLog = require('./models/AccessLog');
const Book = require('./models/Book');
const LibraryTransaction = require('./models/LibraryTransaction');
const Session = require('./models/Session');
const AttendanceLog = require('./models/AttendanceLog');

// --- 2. IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const nfcRoutes = require('./routes/nfcRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const bleRoutes = require('./routes/bleRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const attendanceMarkRoute = require('./routes/attendanceMarkRoute');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// --- 3. REGISTER ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/ble', bleRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/attendance', attendanceMarkRoute);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;

// 🚀 NEW: MOCK QUIZ ROUTE FOR TOMORROW'S DEMO
app.get('/api/quiz/analytics', (req, res) => {
    res.json({
        quizTitle: "Week 4: Advanced JavaScript",
        classAverage: 82,
        totalParticipants: 45,
        hardestQuestion: "What is the Virtual DOM?",
        accuracyOnHardest: 32,
        topPerformers: ["Jalaj", "Harman", "Guari"]
    });
});

// ======================================================
// 🚀 CSV BULK IMPORT FUNCTION
// ======================================================
const importStudentsFromCSV = async () => {
    try {
        const results = [];

        const existingStudents = await User.count({
            where: { role: 'student' }
        });

        if (existingStudents > 0) {
            console.log('⚠️ Students already exist. Skipping CSV import.');
            return;
        }

        return new Promise((resolve, reject) => {
            fs.createReadStream('students.csv')
                .pipe(csv())
                .on('data', (data) => {
                    results.push({
                        prn: data.prn,
                        name: data.name,
                        batch: data.batch,
                        division: data.division,
                        email: data.email,
                        role: 'student',
                        engagement_score: 100
                    });
                })
                .on('end', async () => {
                    try {
                        await User.bulkCreate(results);
                        console.log(`✅ Imported ${results.length} students from CSV`);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                })
                .on('error', reject);
        });

    } catch (err) {
        console.error('❌ CSV Import Error:', err);
    }
};



// ======================================================
// 🚀 START SERVER
// ======================================================
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database Synced');

        await importStudentsFromCSV();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 ESP32 URL: http://[YOUR_IP]:${PORT}/api/ble/telemetry`);
        });

    } catch (err) {
        console.error('❌ Database Sync Error:', err);
    }
};

startServer();
