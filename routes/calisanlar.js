const express = require('express');
const router = express.Router();
const Calisan = require('../models/calisan');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     Calisan:
 *       type: object
 *       required:
 *         - ad
 *         - soyad
 *       properties:
 *         id:
 *           type: integer
 *           description: Çalışan ID'si
 *         ad:
 *           type: string
 *           description: Çalışanın adı
 *         soyad:
 *           type: string
 *           description: Çalışanın soyadı
 *         telefon:
 *           type: string
 *           description: Çalışanın telefon numarası
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /calisanlar:
 *   get:
 *     summary: Tüm çalışanları listeler
 *     security:
 *       - bearerAuth: []
 *     tags: [Çalışanlar]
 *     responses:
 *       200:
 *         description: Çalışan listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calisan'
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', async (req, res) => {
    try {
        const calisanlar = await Calisan.findAll();
        res.status(200).json(calisanlar);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /calisanlar:
 *   post:
 *     summary: Yeni çalışan ekler
 *     tags: [Çalışanlar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ad
 *               - soyad
 *             properties:
 *               ad:
 *                 type: string
 *               soyad:
 *                 type: string
 *               telefon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Çalışan başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calisan'
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', async (req, res) => {
    const { ad, soyad, telefon } = req.body;
    try {
        const yeniCalisan = await Calisan.create({ ad, soyad, telefon });
        res.status(201).json(yeniCalisan);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /calisanlar/{id}:
 *   get:
 *     summary: Belirli bir çalışanın detaylarını getirir
 *     tags: [Çalışanlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Çalışan ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Çalışan detayları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calisan'
 *       404:
 *         description: Çalışan bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
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

/**
 * @swagger
 * /calisanlar/{id}:
 *   put:
 *     summary: Çalışan bilgilerini günceller
 *     tags: [Çalışanlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Çalışan ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ad:
 *                 type: string
 *               soyad:
 *                 type: string
 *               telefon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Çalışan bilgileri başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calisan'
 *       404:
 *         description: Çalışan bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
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

/**
 * @swagger
 * /calisanlar/{id}:
 *   delete:
 *     summary: Çalışanı siler
 *     tags: [Çalışanlar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Çalışan ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Çalışan başarıyla silindi
 *       404:
 *         description: Çalışan bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
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