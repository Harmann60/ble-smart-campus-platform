const express = require('express');
const SimpleAttendance = require('../models/SimpleAttendance');

const router = express.Router();

const fallbackAttendance = [];
const activeStudents = new Map();

const upsertActiveStudent = (student_id, classroom) => {
    activeStudents.set(student_id, {
        student_id,
        classroom,
        active: true,
        updated_at: new Date().toISOString()
    });
};

const removeActiveStudent = (student_id) => {
    activeStudents.delete(student_id);
};

router.get('/', async (req, res) => {
        try {
            const records = await SimpleAttendance.findAll({
                order: [['marked_at', 'DESC']]
            });

            return res.json({
                success: true,
                data: records
            });

        } catch (error) {
            console.log('[attendance-api] GET error:', error.message);

            return res.json({
                success: true,
                data: fallbackAttendance
            });
        }
    });

router.get('/live', (req, res) => {
    return res.json({
        success: true,
        data: Array.from(activeStudents.values())
    });
});

router.post('/', async (req, res) => {
    const { student_id, classroom, action } = req.body || {};
    const normalizedAction = (action || 'start').toString().trim().toLowerCase();

    console.log('[attendance-api] Incoming request', { student_id, classroom, action: normalizedAction });

    if (
        typeof student_id !== 'string' ||
        typeof classroom !== 'string' ||
        !student_id.trim() ||
        !classroom.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: 'student_id and classroom are required'
        });
    }

    const normalizedStudentId = student_id.trim();
    const normalizedClassroom = classroom.trim();
    const now = new Date();

    if (normalizedAction === 'stop') {
        removeActiveStudent(normalizedStudentId);

        console.log('[attendance-api] Stop Success', {
            student_id: normalizedStudentId,
            classroom: normalizedClassroom
        });

        return res.json({
            success: true,
            message: 'Attendance stopped'
        });
    }

    try {
        await SimpleAttendance.create({
            student_id: normalizedStudentId,
            classroom: normalizedClassroom,
            marked_at: now
        });
        upsertActiveStudent(normalizedStudentId, normalizedClassroom);

        console.log('[attendance-api] Success', {
            student_id: normalizedStudentId,
            classroom: normalizedClassroom,
            storage: 'database'
        });

        return res.json({
            success: true,
            message: 'Attendance marked'
        });
    } catch (error) {
        fallbackAttendance.push({
            student_id: normalizedStudentId,
            classroom: normalizedClassroom,
            marked_at: now
        });
        upsertActiveStudent(normalizedStudentId, normalizedClassroom);

        console.log('[attendance-api] Success', {
            student_id: normalizedStudentId,
            classroom: normalizedClassroom,
            storage: 'memory',
            fallback_reason: error.message
        });

        return res.json({
            success: true,
            message: 'Attendance marked'
        });
    }
});

router.post('/stop', (req, res) => {
    const { student_id } = req.body || {};

    if (typeof student_id !== 'string' || !student_id.trim()) {
        return res.status(400).json({
            success: false,
            message: 'student_id is required'
        });
    }

    const normalizedStudentId = student_id.trim();
    removeActiveStudent(normalizedStudentId);

    console.log('[attendance-api] Stop Success', {
        student_id: normalizedStudentId
    });

    return res.json({
        success: true,
        message: 'Attendance stopped'
    });
});

module.exports = router;
