const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Calisan = sequelize.define('Calisan', {
    ad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    soyad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefon: {
        type: DataTypes.STRING,
        unique: true,
    },
}, {
    tableName: 'calisanlar',
    timestamps: true, // `olusturulma_tarihi` için
});

module.exports = Calisan;
