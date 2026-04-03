const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Session, AttendanceLog, User } = require('../models');

const normalizeStatus = (status) => {
    if (status === 'present' || status === 'late' || status === 'absent') {
        return status;
    }

    return 'absent';
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withSqliteRetry = async (operation, retries = 5, delayMs = 120) => {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            const isLocked =
                error?.name === 'SequelizeTimeoutError' ||
                error?.original?.code === 'SQLITE_BUSY' ||
                error?.parent?.code === 'SQLITE_BUSY';

            if (!isLocked || attempt === retries) {
                throw error;
            }

            await sleep(delayMs * (attempt + 1));
        }
    }

    throw lastError;
};

const saveAttendanceRows = async (sessionId, attendance) => {
    const filteredRows = attendance.filter(
        (row) => row && row.student_id !== undefined && row.student_id !== null
    );

    if (filteredRows.length === 0) {
        return { saved: 0, skipped: 0 };
    }

    const now = new Date();
    let skippedRows = 0;

    for (const row of filteredRows) {
        const parsedStudentId = Number.parseInt(row.student_id, 10);
        if (Number.isNaN(parsedStudentId)) {
            skippedRows += 1;
            continue;
        }

        const status = normalizeStatus(row.status);
        const comment = row.comment ? String(row.comment) : '';

        await withSqliteRetry(async () => {
            const [log] = await AttendanceLog.findOrCreate({
                where: {
                    session_id: sessionId,
                    student_id: parsedStudentId
                },
                defaults: {
                    session_id: sessionId,
                    student_id: parsedStudentId,
                    first_seen: status === 'absent' ? null : now,
                    last_seen: status === 'absent' ? null : now,
                    is_present: status === 'present',
                    status,
                    comment,
                    manual_override: true
                }
            });

            log.status = status;
            log.comment = comment;
            log.is_present = status === 'present';
            log.manual_override = true;

            if (status === 'absent') {
                log.first_seen = log.first_seen || null;
            } else {
                log.first_seen = log.first_seen || now;
                log.last_seen = now;
            }

            await log.save();
        });
    }

    return {
        saved: filteredRows.length - skippedRows,
        skipped: skippedRows
    };
};

const buildSessionLog = async (session) => {
    const logs = await AttendanceLog.findAll({
        where: { session_id: session.id },
        include: [
            {
                model: User,
                attributes: ['student_id', 'prn', 'name']
            }
        ],
        order: [['updatedAt', 'DESC']]
    });

    const students = logs.map((log) => ({
        student_id: log.student_id,
        prn: log.User?.prn || `PRN-${log.student_id}`,
        name: log.User?.name || `Student ${log.student_id}`,
        status: normalizeStatus(log.status),
        comment: log.comment || ''
    }));

    const totalPresent = students.filter((student) => student.status === 'present').length;
    const roomLabel = session.room_no ? `Room ${session.room_no}` : session.division;
    const startTime = session.start_time ? new Date(session.start_time) : null;
    const endTime = session.end_time ? new Date(session.end_time) : null;

    return {
        id: session.id,
        className: `${roomLabel} - ${session.subject}`,
        room_no: session.room_no || '',
        subject: session.subject,
        batch: session.batch,
        division: session.division,
        start_time: startTime,
        end_time: endTime,
        totalPresent,
        totalStudents: students.length,
        students
    };
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

        const parsedSessionId = Number.parseInt(session_id, 10);
        if (Number.isNaN(parsedSessionId)) {
            return res.status(400).json({ error: 'Invalid session_id' });
        }

        if (!Array.isArray(attendance) || attendance.length === 0) {
            return res.status(400).json({ error: 'No valid attendance rows provided' });
        }

        const session = await Session.findByPk(parsedSessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const { saved, skipped } = await saveAttendanceRows(parsedSessionId, attendance);

        res.json({
            success: true,
            saved,
            skipped
        });
    } catch (err) {
        console.error('[attendance/save] error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/logs', async (req, res) => {
    try {
        const { session_id, attendance } = req.body;

        const parsedSessionId = Number.parseInt(session_id, 10);
        if (Number.isNaN(parsedSessionId)) {
            return res.status(400).json({ error: 'Invalid session_id' });
        }

        const session = await Session.findByPk(parsedSessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        let saved = 0;
        let skipped = 0;
        if (Array.isArray(attendance) && attendance.length > 0) {
            const result = await saveAttendanceRows(parsedSessionId, attendance);
            saved = result.saved;
            skipped = result.skipped;
        }

        const logData = await buildSessionLog(session);
        res.json({ success: true, saved, skipped, data: logData });
    } catch (err) {
        console.error('[attendance/logs] error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const sessions = await Session.findAll({
            order: [['start_time', 'DESC']]
        });

        const logs = await Promise.all(sessions.map((session) => buildSessionLog(session)));
        res.json({ success: true, data: logs });
    } catch (err) {
        console.error('[attendance/logs] fetch error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/logs', async (req, res) => {
    try {
        const sessionIds = Array.isArray(req.body?.session_ids)
            ? req.body.session_ids
                .map((id) => Number.parseInt(id, 10))
                .filter((id) => !Number.isNaN(id))
            : [];

        if (sessionIds.length === 0) {
            return res.status(400).json({ error: 'session_ids is required' });
        }

        await AttendanceLog.destroy({
            where: {
                session_id: {
                    [Op.in]: sessionIds
                }
            }
        });

        const deletedSessions = await Session.destroy({
            where: {
                id: {
                    [Op.in]: sessionIds
                }
            }
        });

        res.json({ success: true, deleted_sessions: deletedSessions });
    } catch (err) {
        console.error('[attendance/logs] delete error:', err);
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
