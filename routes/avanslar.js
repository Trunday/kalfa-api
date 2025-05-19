const express = require('express');
const router = express.Router();
const Avans = require('../models/avanslar');

// Swagger schema for Avans
/**
 * @swagger
 * components:
 *   schemas:
 *     Avans:
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
 * /avanslar:
 *   get:
 *     summary: Avansları listeleme
 *     tags: [Avanslar]
 *     responses:
 *       200:
 *         description: Avans listesi başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avans'
 *       500:
 *         description: Sunucu hatası.
 */
router.get('/', async (req, res) => {
    try {
        const avanslar = await Avans.findAll();
        res.status(200).json(avanslar);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /avanslar:
 *   post:
 *     summary: Yeni avans ekleme
 *     tags: [Avanslar]
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
 *         description: Yeni avans başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avans'
 *       500:
 *         description: Sunucu hatası.
 */
router.post('/', async (req, res) => {
    const { tarih, miktar, calisan_id } = req.body;
    try {
        const yeniAvans = await Avans.create({ tarih, miktar, calisan_id });
        res.status(201).json(yeniAvans);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /avanslar/{id}:
 *   get:
 *     summary: Belirli bir avansı getirme
 *     tags: [Avanslar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Avansın ID'si
 *     responses:
 *       200:
 *         description: Avans detayları başarıyla getirildi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avans'
 *       404:
 *         description: Avans bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
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

/**
 * @swagger
 * /avanslar/{id}:
 *   put:
 *     summary: Avans güncelleme
 *     tags: [Avanslar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek avansın ID'si
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
 *         description: Avans başarıyla güncellendi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avans'
 *       404:
 *         description: Avans bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
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

/**
 * @swagger
 * /avanslar/{id}:
 *   delete:
 *     summary: Avans silme
 *     tags: [Avanslar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek avansın ID'si
 *     responses:
 *       204:
 *         description: Avans başarıyla silindi.
 *       404:
 *         description: Avans bulunamadı.
 *       500:
 *         description: Sunucu hatası.
 */
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