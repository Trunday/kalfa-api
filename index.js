const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Sequelize bağlantısı
const Calisan = require('./models/calisan'); // Çalışan modeli

const app = express();
const port = 3000;

// JSON istek gövdelerini işlemek için middleware
app.use(bodyParser.json());

// Veritabanı senkronizasyonu
sequelize.sync({ alter: true })
    .then(() => console.log('Modeller senkronize edildi'))
    .catch((err) => console.error('Senkranizasyon hatası:', err));

// Basit bir test endpoint'i
app.get('/', (req, res) => {
    res.send('Kalfa API çalışıyor!');
});

// Çalışanları listeleme
app.get('/calisanlar', async (req, res) => {
    try {
        const calisanlar = await Calisan.findAll();
        res.status(200).json(calisanlar);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Yeni çalışan ekleme
app.post('/calisanlar', async (req, res) => {
    const { ad, soyad, telefon } = req.body;
    try {
        const yeniCalisan = await Calisan.create({ ad, soyad, telefon });
        res.status(201).json(yeniCalisan);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Belirli bir çalışanın detaylarını getirme
app.get('/calisanlar/:id', async (req, res) => {
    try {
        const calisan = await Calisan.findByPk(req.params.id);
        if (calisan) {
            res.status(200).json(calisan);
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Çalışan güncelleme
app.put('/calisanlar/:id', async (req, res) => {
    const { ad, soyad, telefon } = req.body;
    try {
        const calisan = await Calisan.findByPk(req.params.id);
        if (calisan) {
            calisan.ad = ad;
            calisan.soyad = soyad;
            calisan.telefon = telefon;
            await calisan.save();
            res.status(200).json(calisan);
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Çalışan silme
app.delete('/calisanlar/:id', async (req, res) => {
    try {
        const sonuc = await Calisan.destroy({ where: { id: req.params.id } });
        if (sonuc) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor: http://localhost:${port}`);
});
