const { sequelize } = require('../config/db');

// 👇 FORCE LOAD ALL MODELS FIRST
const User = require('./User');
const LibraryTransaction = require('./LibraryTransaction');
const Session = require('./Session');
const AttendanceLog = require('./AttendanceLog');

// 👇 DEFINE RELATIONS AFTER ALL MODELS ARE LOADED
Session.hasMany(AttendanceLog, { foreignKey: 'session_id' });
AttendanceLog.belongsTo(Session, { foreignKey: 'session_id' });

// 👇 DEBUG (VERY IMPORTANT - REMOVE LATER)
console.log("Loaded Models:", Object.keys(sequelize.models));

const syncDB = async () => {
    try {
        // 👇 ENSURE MODELS ARE REGISTERED BEFORE SYNC
        await sequelize.sync({ alter: true });

        console.log("✅ Models Synced");
    } catch (error) {
        console.log("❌ Sync Error:", error);
    }
};

module.exports = {
    sequelize,
    syncDB,
    User,
    LibraryTransaction,
    Session,
    AttendanceLog
};