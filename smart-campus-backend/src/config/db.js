const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../smart_campus.db'),
    logging: false,
    pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        max: 5
    },
    dialectOptions: {
        foreignKeys: false
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query('PRAGMA foreign_keys = OFF;');
        await sequelize.query('PRAGMA journal_mode = WAL;');
        await sequelize.query('PRAGMA busy_timeout = 5000;');
        console.log('Connected to SQLite Database (Foreign Keys Disabled)!');
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
};

module.exports = { sequelize, connectDB };
