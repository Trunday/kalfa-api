const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Calisan = require('./calisan'); // Çalışan modelini içe aktar

const Avans = sequelize.define('Avans', {
    tarih: {
        type: DataTypes.DATE,
        allowNull: false, // Tarih boş bırakılamaz
    },
    miktar: {
        type: DataTypes.FLOAT,
        allowNull: false, // Avans miktarı boş bırakılamaz
    },
}, {
    tableName: 'avanslar', // Tablo adı
    timestamps: false, // createdAt ve updatedAt eklenmesin
});

// Her avans bir çalışana ait
Avans.belongsTo(Calisan, { foreignKey: 'calisan_id' });
module.exports = Avans;
