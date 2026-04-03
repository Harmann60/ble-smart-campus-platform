const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    batch: {
        type: DataTypes.STRING,
        allowNull: false
    },
    division: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    min_attendance_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 45
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Session;
