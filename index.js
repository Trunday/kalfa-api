const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Sequelize bağlantısı
const Calisan = require('./models/calisan'); // Çalışan modeli
const Is = require('./models/isler'); // İş modelini içe aktarıyoruz

const app = express();
const port = 3000;

// JSON istek gövdelerini işlemek için middleware
app.use(bodyParser.json());

// Veritabanı senkronizasyonu
sequelize.sync({ alter: true })
    .then(() => console.log('Tüm modeller senkronize edildi.'))
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

app.get('/isler', async (req, res) => {
    try {
        const isler = await Is.findAll(); // Tüm işleri getir
        res.status(200).json(isler); // JSON olarak gönder
    } catch (error) {
        console.error('İşler getirilirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

app.post('/isler', async (req, res) => {
    const { calisan_id, tarih, miktar, birim, birim_ucret } = req.body;

    try {
        const yeniIs = await Is.create({
            calisan_id,
            tarih,
            miktar,
            birim,
            birim_ucret,
            toplam_ucret: miktar * birim_ucret, // Toplam ücret otomatik hesaplanabilir
        });

        res.status(201).json(yeniIs); // 201 Created ile yanıt dön
    } catch (error) {
        console.error('Yeni iş eklenirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

app.get('/isler/:id', async (req, res) => {
    try {
        const is = await Is.findByPk(req.params.id); // ID'ye göre işi bul

        if (is) {
            res.status(200).json(is); // JSON olarak dön
        } else {
            res.status(404).json({ message: 'İş bulunamadı.' });
        }
    } catch (error) {
        console.error('İş getirilirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

app.put('/isler/:id', async (req, res) => {
    const { miktar, birim, birim_ucret } = req.body;

    try {
        const is = await Is.findByPk(req.params.id);

        if (is) {
            // İlgili alanları güncelle
            is.miktar = miktar || is.miktar;
            is.birim = birim || is.birim;
            is.birim_ucret = birim_ucret || is.birim_ucret;
            is.toplam_ucret = is.miktar * is.birim_ucret; // Toplam ücreti güncelle
            await is.save(); // Veritabanına kaydet

            res.status(200).json(is); // Güncellenen işi dön
        } else {
            res.status(404).json({ message: 'İş bulunamadı.' });
        }
    } catch (error) {
        console.error('İş güncellenirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

app.delete('/isler/:id', async (req, res) => {
    try {
        const silinenSatirSayisi = await Is.destroy({ where: { id: req.params.id } });

        if (silinenSatirSayisi) {
            res.status(204).send(); // 204 No Content dön
        } else {
            res.status(404).json({ message: 'İş bulunamadı.' });
        }
    } catch (error) {
        console.error('İş silinirken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`API ${port} portunda çalışıyor: http://localhost:${port}`);
});
