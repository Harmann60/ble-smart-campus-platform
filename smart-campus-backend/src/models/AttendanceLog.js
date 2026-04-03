const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AttendanceLog = sequelize.define('AttendanceLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    first_seen: {
        type: DataTypes.DATE
    },
    last_seen: {
        type: DataTypes.DATE
    },
    total_time_present: {
        type: DataTypes.INTEGER, // seconds
        defaultValue: 0
    },
    is_present: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('present', 'late', 'absent'),
        allowNull: false,
        defaultValue: 'absent'
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    manual_override: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = AttendanceLog;
