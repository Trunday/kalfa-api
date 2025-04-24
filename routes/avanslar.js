const express = require('express');
const router = express.Router();
const Avans = require('../models/avanslar');

// Avansları listeleme
router.get('/', async (req, res) => {
    try {
        const avanslar = await Avans.findAll();
        res.status(200).json(avanslar);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Yeni avans ekleme
router.post('/', async (req, res) => {
    const { tarih, miktar, calisan_id } = req.body;
    try {
        const yeniAvans = await Avans.create({ tarih, miktar, calisan_id });
        res.status(201).json(yeniAvans);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Belirli bir avansı getirme
router.get('/:id', async (req, res) => {
    try {
        const avans = await Avans.findByPk(req.params.id);
        if (avans) {
            res.status(200).json(avans);
        } else {
            res.status(404).json({ message: 'Avans bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Avans güncelleme
router.put('/:id', async (req, res) => {
    const { tarih, miktar, calisan_id } = req.body;
    try {
        const avans = await Avans.findByPk(req.params.id);
        if (avans) {
            Object.assign(avans, { tarih, miktar, calisan_id });
            await avans.save();
            res.status(200).json(avans);
        } else {
            res.status(404).json({ message: 'Avans bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

// Avans silme
router.delete('/:id', async (req, res) => {
    try {
        const sonuc = await Avans.destroy({ where: { id: req.params.id } });
        if (sonuc) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Avans bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

module.exports = router;