const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    rol: {
        type: DataTypes.ENUM("admin", "user", "manager","kalfa","çalışan"), 
        allowNull: true,
    },
    notlar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    adres : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dogum_tarihi: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;