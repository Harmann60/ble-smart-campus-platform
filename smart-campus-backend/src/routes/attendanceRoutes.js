const express = require('express');
const router = express.Router();

const { Session, AttendanceLog, User } = require('../models');

const normalizeStatus = (status) => {
    if (status === 'present' || status === 'late' || status === 'absent') {
        return status;
    }

    return 'absent';
};

// NFC/BLE update for the active session
router.post('/update', async (req, res) => {
    try {
        const { student_id, rssi } = req.body;

        const session = await Session.findOne({
            where: { is_active: true }
        });

        if (!session) {
            return res.json({ message: 'No active session' });
        }

        let log = await AttendanceLog.findOne({
            where: {
                session_id: session.id,
                student_id
            }
        });

        const now = new Date();

        if (!log) {
            log = await AttendanceLog.create({
                session_id: session.id,
                student_id,
                first_seen: now,
                last_seen: now,
                total_time_present: 0,
                is_present: true,
                status: 'present'
            });
        } else {
            const diff = log.last_seen ? (now - new Date(log.last_seen)) / 1000 : 0;

            log.total_time_present += diff;
            log.last_seen = now;
            log.is_present = true;
            log.status = 'present';

            if (!log.first_seen) {
                log.first_seen = now;
            }

            await log.save();
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/manual', async (req, res) => {
    try {
        const { session_id, student_id } = req.body;

        const [log] = await AttendanceLog.findOrCreate({
            where: { session_id, student_id },
            defaults: {
                session_id,
                student_id,
                first_seen: new Date(),
                last_seen: new Date(),
                is_present: true,
                status: 'present',
                manual_override: true
            }
        });

        log.is_present = true;
        log.status = 'present';
        log.manual_override = true;
        await log.save();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/session/:session_id/students', async (req, res) => {
    try {
        const session = await Session.findByPk(req.params.session_id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const students = await User.findAll({
            where: {
                role: 'student',
                batch: session.batch,
                division: session.division
            },
            order: [['name', 'ASC']]
        });

        const logs = await AttendanceLog.findAll({
            where: { session_id: session.id }
        });

        const logsByStudent = new Map(logs.map((log) => [log.student_id, log]));

        const rows = students.map((student) => {
            const log = logsByStudent.get(student.student_id);

            return {
                student_id: student.student_id,
                prn: student.prn || `PRN-${student.student_id}`,
                name: student.name,
                batch: student.batch,
                division: student.division,
                status: log ? normalizeStatus(log.status) : 'absent',
                comment: log?.comment || '',
                is_present: log?.is_present || false,
                detected_at: log?.last_seen || null,
                manual_override: log?.manual_override || false
            };
        });

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/save', async (req, res) => {
    try {
        const { session_id, attendance } = req.body;

        if (!session_id || !Array.isArray(attendance)) {
            return res.status(400).json({ error: 'session_id and attendance are required' });
        }

        const now = new Date();

        await Promise.all(
            attendance.map(async (row) => {
                const status = normalizeStatus(row.status);

                const [log] = await AttendanceLog.findOrCreate({
                    where: {
                        session_id,
                        student_id: row.student_id
                    },
                    defaults: {
                        session_id,
                        student_id: row.student_id,
                        first_seen: status === 'absent' ? null : now,
                        last_seen: status === 'absent' ? null : now,
                        is_present: status === 'present',
                        status,
                        comment: row.comment || '',
                        manual_override: true
                    }
                });

                log.status = status;
                log.comment = row.comment || '';
                log.is_present = status === 'present';
                log.manual_override = true;

                if (status === 'absent') {
                    log.first_seen = log.first_seen || null;
                } else {
                    log.first_seen = log.first_seen || now;
                    log.last_seen = now;
                }

                await log.save();
            })
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:session_id', async (req, res) => {
    const logs = await AttendanceLog.findAll({
        where: { session_id: req.params.session_id }
    });

    res.json(logs);
});

module.exports = router;
