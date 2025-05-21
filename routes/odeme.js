const express = require('express');
const router = express.Router();
const Odeme = require('../models/odeme');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

// Swagger schema for Odeme
/**
 * @swagger
 * components:
 *   schemas:
 *     Odeme:
 *       type: object
 *       required:
 *         - tarih
 *         - miktar
 *         - odeme_turu
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *         tarih:
 *           type: string
 *           format: date
 *         miktar:
 *           type: number
 *         aciklama:
 *           type: string
 *         odeme_turu:
 *           type: string
 *           enum: [avans, maaş, prim, ikramiye]
 *         odeme_tipi:
 *           type: string
 *         user_id:
 *           type: integer
 */

router.get('/', async (req, res) => {
    try {
        const odemeler = await Odeme.findAll({
            include: ['User'] // İlişkili kullanıcı bilgilerini getir
        });
        res.status(200).json(odemeler);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.post('/', async (req, res) => {
    const { tarih, miktar, aciklama, odeme_turu, odeme_tipi, user_id } = req.body;
    try {
        const yeniOdeme = await Odeme.create({
            tarih,
            miktar,
            aciklama,
            odeme_turu,
            odeme_tipi,
            user_id
        });
        res.status(201).json(yeniOdeme);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const odeme = await Odeme.findByPk(req.params.id, {
            include: ['User']
        });
        if (odeme) {
            res.status(200).json(odeme);
        } else {
            res.status(404).json({ message: 'Ödeme bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.put('/:id', async (req, res) => {
    const { tarih, miktar, aciklama, odeme_turu, odeme_tipi, user_id } = req.body;
    try {
        const odeme = await Odeme.findByPk(req.params.id);
        if (odeme) {
            await odeme.update({
                tarih,
                miktar,
                aciklama,
                odeme_turu,
                odeme_tipi,
                user_id
            });
            res.status(200).json(odeme);
        } else {
            res.status(404).json({ message: 'Ödeme bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

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