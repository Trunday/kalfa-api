const express = require('express');
const router = express.Router();
const Odeme = require('../models/odeme');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

// Swagger schema for Ödeme
/**
 * @swagger
 * components:
 *   schemas:
 *     Odeme:
 *       type: object
 *       required:
 *         - tarih
 *         - miktar
 *       properties:
 *         id:
 *           type: integer
 *         tarih:
 *           type: string
 *           format: date
 *         miktar:
 *           type: number
 *         calisan_id:
 *           type: integer
 */

/**
 * @swagger
 * /odeme:
 *   get:
 *     summary: Ödemeleri listeleme
 *     tags: [Ödemeler]
 *     responses:
 *       200:
 *         description: Ödeme listesi başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Odeme'
 *       500:
 *         description: Sunucu hatası.
 */
router.get('/', async (req, res) => {
    try {
        const odemeler = await Odeme.findAll();
        res.status(200).json(odemeler);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /odeme:
 *   post:
 *     summary: Yeni ödeme ekleme
 *     tags: [Ödemeler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tarih
 *               - miktar
 *             properties:
 *               tarih:
 *                 type: string
 *                 format: date
 *               miktar:
 *                 type: number
 *               calisan_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Yeni ödeme başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Odeme'
 *       500:
 *         description: Sunucu hatası.
 */
router.post('/', async (req, res) => {
    const { tarih, miktar, calisan_id } = req.body;
    try {
        const yeniOdeme = await Odeme.create({ tarih, miktar, calisan_id });
        res.status(201).json(yeniOdeme);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /odeme/{id}:
 *   get:
 *     summary: Belirli bir ödemeyi getirme
 *     tags: [Ödemeler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ödemenin ID'si
 *     responses:
 *       200:
 *         description: Ödeme detayları başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Odeme'
 *       404:
 *         description: Ödeme bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
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

/**
 * @swagger
 * /odeme/{id}:
 *   put:
 *     summary: Ödeme güncelleme
 *     tags: [Ödemeler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek ödemenin ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tarih:
 *                 type: string
 *                 format: date
 *               miktar:
 *                 type: number
 *               calisan_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ödeme başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Odeme'
 *       404:
 *         description: Ödeme bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
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

/**
 * @swagger
 * /odeme/{id}:
 *   delete:
 *     summary: Ödeme silme
 *     tags: [Ödemeler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek ödemenin ID'si
 *     responses:
 *       204:
 *         description: Ödeme başarıyla silindi.
 *       404:
 *         description: Ödeme bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
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