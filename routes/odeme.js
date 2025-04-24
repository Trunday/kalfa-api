const express = require('express');
const router = express.Router();
const Odeme = require('../models/odeme');

// Ödemeleri listeleme
router.get('/', async (req, res) => {
    try {
        const odemeler = await Odeme.findAll();
        res.status(200).json(odemeler);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Yeni ödeme ekleme
router.post('/', async (req, res) => {
    const { tarih, miktar, calisan_id } = req.body;
    try {
        const yeniOdeme = await Odeme.create({ tarih, miktar, calisan_id });
        res.status(201).json(yeniOdeme);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Belirli bir ödemeyi getirme
router.get('/:id', async (req, res) => {
    try {
        const odeme = await Odeme.findByPk(req.params.id);
        if (odeme) {
            res.status(200).json(odeme);
        } else {
            res.status(404).json({ message: 'Ödeme bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Ödeme güncelleme
router.put('/:id', async (req, res) => {
    const { tarih, miktar, calisan_id } = req.body;
    try {
        const odeme = await Odeme.findByPk(req.params.id);
        if (odeme) {
            Object.assign(odeme, { tarih, miktar, calisan_id });
            await odeme.save();
            res.status(200).json(odeme);
        } else {
            res.status(404).json({ message: 'Ödeme bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Ödeme silme
router.delete('/:id', async (req, res) => {
    try {
        const sonuc = await Odeme.destroy({ where: { id: req.params.id } });
        if (sonuc) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Ödeme bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

module.exports = router;