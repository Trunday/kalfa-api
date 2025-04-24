const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

// Route dosyalarını içe aktarın
const calisanlarRoutes = require('./routes/calisanlar');
const islerRoutes = require('./routes/isler');
const avanslarRoutes = require('./routes/avanslar');
const odemeRoutes = require('./routes/odeme');

const app = express();
const port = 3000;

// JSON istek gövdelerini işlemek için middleware
app.use(bodyParser.json());

// Veritabanı senkronizasyonu
sequelize.sync({ alter: true })
    .then(() => console.log('Tüm modeller senkronize edildi.'))
    .catch((err) => console.error('Senkranizasyon hatası:', err));

// Route'ları kullanın
app.use('/calisanlar', calisanlarRoutes);
app.use('/isler', islerRoutes);
app.use('/avanslar', avanslarRoutes);
app.use('/odeme', odemeRoutes);

// Basit bir test endpoint'i
app.get('/', (req, res) => {
    res.send('Kalfa API çalışıyor!');
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor: http://localhost:${port}`);
});
