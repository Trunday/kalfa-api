const { Sequelize } = require('sequelize');
require('dotenv').config(); // .env dosyasını yükle

const sequelize = new Sequelize(
    process.env.DB_NAME, // Veritabanı adı
    process.env.DB_USER, // Kullanıcı adı
    process.env.DB_PASSWORD, // Şifre
    {
        host: process.env.DB_HOST, // Host
        dialect: process.env.DB_DIALECT, // Dialect (ör: mysql)
        logging: false, // Konsolda SQL sorgularını görmemek için
    }
);

sequelize.authenticate()
    .then(() => console.log('Veritabanı bağlantısı başarılı!'))
    .catch((err) => console.error('Veritabanı bağlantısı hatası:', err));

module.exports = sequelize;
