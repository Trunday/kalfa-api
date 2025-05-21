const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // User modelini içe aktar

const Is = sequelize.define('Is', {
    tarih: {
        type: DataTypes.DATE,
        allowNull: false, // Tarih boş bırakılamaz
    },
    miktar: {
        type: DataTypes.FLOAT,
        allowNull: false, // Miktar boş bırakılamaz
    },
    birim: {
        type: DataTypes.STRING,
        allowNull: false, // Birim boş bırakılamaz (ör: metrekare, saat)
    },
    birim_ucret: {
        type: DataTypes.FLOAT,
        allowNull: false, // Birim ücret boş bırakılamaz
    },
    toplam_ucret: {
        type: DataTypes.FLOAT,
        allowNull: true, // Otomatik hesaplanabilir
    },
    aciklama: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    durum: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    proje_adi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'isler', // Tablo adı
    timestamps: false, // createdAt ve updatedAt eklenmesin
});

// Bir iş bir kullanıcıya atanır
Is.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Is;
