const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Route dosyalarını içe aktarın
const islerRoutes = require('./routes/isler');
const odemeRoutes = require('./routes/odeme');
const authRoutes = require('./routes/auth');
const calisanlarRoutes = require('./routes/calisanlar');

const app = express();
const port = 3000;

// JSON istek gövdelerini işlemek için middleware
app.use(bodyParser.json());

// Veritabanı senkronizasyonu
sequelize.sync({ alter: true })
    .then(() => console.log('Tüm modeller senkronize edildi.'))
    .catch((err) => console.error('Senkranizasyon hatası:', err));

// Route'ları kullanın
app.use('/isler', islerRoutes);
app.use('/odeme', odemeRoutes);
app.use('/auth', authRoutes);
app.use('/calisanlar', calisanlarRoutes);

// Swagger UI'ı ekle
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Basit bir test endpoint'i
app.get('/', (req, res) => {
    res.send('Kalfa API çalışıyor!');
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor: http://localhost:${port}`);
});
