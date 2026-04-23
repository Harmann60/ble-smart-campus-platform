const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AccessLog = require('../models/AccessLog');

// In-Memory Store for Live Proximity Detection
let activeClassroom = {};


// ---------------------------------------------------------
// 1. IOT INGESTION ENDPOINT (ESP32 Gateway POSTs here)
// ---------------------------------------------------------
router.post('/telemetry', async (req, res) => {

    const { gateway_id, beacons } = req.body;
    const currentTime = Date.now();

    if (!gateway_id || !Array.isArray(beacons)) {
        return res.status(400).json({ error: "Invalid payload format" });
    }

    try {

        for (const beacon of beacons) {

            if (!beacon.student_id || beacon.rssi === undefined) {
                console.log("Invalid beacon data:", beacon);
                continue;
            }

            console.log("Incoming beacon:", beacon);

            // Ignore weak signals
            if (beacon.rssi <= -80) continue;

            // If student already active, just update timestamp + RSSI
            if (activeClassroom[beacon.student_id]) {

                activeClassroom[beacon.student_id].last_seen = currentTime;
                activeClassroom[beacon.student_id].rssi = beacon.rssi;

                continue;
            }

            // Otherwise lookup student
            const student = await User.findOne({
                where: { student_id: beacon.student_id }
            });

            if (!student) {
                console.log("Unknown student ID:", beacon.student_id);
                continue;
            }

            activeClassroom[beacon.student_id] = {
                student_id: beacon.student_id,
                last_seen: currentTime,
                rssi: beacon.rssi,
                student_name: student.name,
                engagement_score: student.engagement_score
            };

        }

        res.json({
            status: "success",
            processed: beacons.length
        });

    } catch (err) {

        console.error("Telemetry processing error:", err);

        res.status(500).json({
            error: "Internal server error"
        });

    }

});


// ---------------------------------------------------------
// 2. FRONTEND POLLING ENDPOINT (React GETs data from here)
// ---------------------------------------------------------
router.get('/live-radar', (req, res) => {

    const currentTime = Date.now();
    let liveStudents = [];

    for (const id in activeClassroom) {

        const data = activeClassroom[id];

        // Change this in bleRoutes.js (Line 56)
        if (currentTime - data.last_seen < 3600000) { // Keeps them on radar for 1 hour
            liveStudents.push(data);
        } else {
            delete activeClassroom[id];
        }
    }

    res.json(liveStudents);

});


// ---------------------------------------------------------
// 3. SEED DEMO DATA
// ---------------------------------------------------------
router.get('/seed-demo-data', async (req, res) => {

    try {

        const bcrypt = require('bcryptjs');
        const pass = await bcrypt.hash("password123", 10);

        // Admin
        await User.findOrCreate({
            where: { email: "admin@identa.com" },
            defaults: {
                name: "Admin",
                password: pass,
                role: "admin"
            }
        });

        // Students
        await User.upsert({
            student_id: 1,
            prn: "240101001",
            name: "Jalaj Maheshwari",
            email: "jalaj@student.com",
            password: pass,
            role: "student",
            class_name: "CSE A-1",
            engagement_score: 88
        });

        await User.upsert({
            student_id: 2,
            prn: "240101002",
            name: "Harman Jassal",
            email: "harman@student.com",
            password: pass,
            role: "student",
            class_name: "CSE A-1",
            engagement_score: 92
        });

        await User.upsert({
            student_id: 3,
            prn: "240101003",
            name: "Gauri",
            email: "gauri@student.com",
            password: pass,
            role: "student",
            class_name: "CSE A-1",
            engagement_score: 95
        });

        res.send("✅ Database seeded! Login with admin@identa.com / password123");

    } catch (err) {

        console.error("Seed error:", err);

        res.status(500).send("❌ Error seeding DB: " + err.message);

    }

});

module.exports = router;
