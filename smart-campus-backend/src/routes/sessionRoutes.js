const express = require('express');
const router = express.Router();

const { Session } = require('../models');

// ✅ START SESSION
router.post('/start', async (req, res) => {
    try {
        const {
            subject,
            batch,
            division,
            room_no,
            start_time,
            end_time,
            min_attendance_minutes
        } = req.body;

        // deactivate old session
        await Session.update(
            { is_active: false },
            { where: { is_active: true } }
        );

        const session = await Session.create({
            subject,
            batch,
            division,
            room_no: room_no || null,
            start_time,
            end_time,
            min_attendance_minutes,
            is_active: true
        });

        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET ACTIVE SESSION
router.get('/active', async (req, res) => {
    const session = await Session.findOne({
        where: { is_active: true }
    });

    res.json(session);
});

// ⛔ STOP SESSION
router.post('/stop', async (req, res) => {
    await Session.update(
        { is_active: false, end_time: new Date() },
        { where: { is_active: true }
    });

    res.json({ message: "Session stopped" });
});

module.exports = router;
