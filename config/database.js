const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('kalfa_db', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Konsolda SQL sorgularını görmemek için
});

sequelize.authenticate()
    .then(() => console.log('Veritabanı bağlantısı başarılı!'))
    .catch((err) => console.error('Veritabanı bağlantısı hatası:', err));

module.exports = sequelize;
