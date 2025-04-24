const express = require('express');
const router = express.Router();
const Is = require('../models/isler');

// İşleri listeleme
router.get('/', async (req, res) => {
    try {
        const isler = await Is.findAll();
        res.status(200).json(isler);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Yeni iş ekleme
router.post('/', async (req, res) => {
    const { tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id } = req.body;
    try {
        const yeniIs = await Is.create({ tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id });
        res.status(201).json(yeniIs);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Belirli bir işi getirme
router.get('/:id', async (req, res) => {
    try {
        const is = await Is.findByPk(req.params.id);
        if (is) {
            res.status(200).json(is);
        } else {
            res.status(404).json({ message: 'İş bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// İş güncelleme
router.put('/:id', async (req, res) => {
    const { tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id } = req.body;
    try {
        const is = await Is.findByPk(req.params.id);
        if (is) {
            Object.assign(is, { tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id });
            await is.save();
            res.status(200).json(is);
        } else {
            res.status(404).json({ message: 'İş bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// İş silme
router.delete('/:id', async (req, res) => {
    try {
        const sonuc = await Is.destroy({ where: { id: req.params.id } });
        if (sonuc) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'İş bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

module.exports = router;