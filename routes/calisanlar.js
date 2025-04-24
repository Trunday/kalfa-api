const express = require('express');
const router = express.Router();
const Calisan = require('../models/calisan');

// Çalışanları listeleme
router.get('/', async (req, res) => {
    try {
        const calisanlar = await Calisan.findAll();
        res.status(200).json(calisanlar);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Yeni çalışan ekleme
router.post('/', async (req, res) => {
    const { ad, soyad, telefon } = req.body;
    try {
        const yeniCalisan = await Calisan.create({ ad, soyad, telefon });
        res.status(201).json(yeniCalisan);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Belirli bir çalışanın detaylarını getirme
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;