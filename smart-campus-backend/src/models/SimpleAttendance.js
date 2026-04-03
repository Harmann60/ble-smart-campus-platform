const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SimpleAttendance = sequelize.define('SimpleAttendance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    classroom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marked_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = SimpleAttendance;
