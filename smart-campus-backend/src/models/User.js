const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    student_id: {
    type: DataTypes.INTEGER,
    primaryKey : true,
    unique: true,
    allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 👇 ADDED THESE BACK FOR YOUR LOGIN PAGE
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'student' // 'student', 'faculty', 'admin'
    },
    // 👇 IDENTA BLE SYSTEM FIELDS
    ble_mac: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    engagement_score: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    }
}, {
    timestamps: true
});

module.exports = User;