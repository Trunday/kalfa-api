const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Calisan = require('./calisan'); // Çalışan modelini içe aktar

const Odeme = sequelize.define('Odeme', {
    tarih: {
        type: DataTypes.DATE,
        allowNull: false, // Tarih boş bırakılamaz
    },
    miktar: {
        type: DataTypes.FLOAT,
        allowNull: false, // Ödeme miktarı boş bırakılamaz
    },
}, {
    tableName: 'odeme', // Tablo adı
    timestamps: false, // createdAt ve updatedAt eklenmesin
});

// Her ödeme bir çalışana ait
Odeme.belongsTo(Calisan, { foreignKey: 'calisan_id' });
module.exports = Odeme;
