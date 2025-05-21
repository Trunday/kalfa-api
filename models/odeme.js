const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // User modelini içe aktar

const Odeme = sequelize.define(
  "Odeme",
  {
    tarih: {
      type: DataTypes.DATE,
      allowNull: false, // Tarih boş bırakılamaz
    },
    miktar: {
      type: DataTypes.FLOAT,
      allowNull: false, // Ödeme miktarı boş bırakılamaz
    },
    aciklama: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    odeme_turu: {
      type: DataTypes.ENUM("avans", "maaş", "prim", "ikramiye"),
      allowNull: false,
      defaultValue: "maaş",
    },
    odeme_tipi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "odeme", // Tablo adı
    timestamps: false, // createdAt ve updatedAt eklenmesin
  }
);

// İlişkiler
Odeme.belongsTo(User, { foreignKey: "user_id" }); // Her ödeme bir kullanıcıya ait
module.exports = Odeme;
