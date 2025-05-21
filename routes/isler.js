const express = require('express');
const router = express.Router();
const Is = require('../models/isler');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

// Swagger schema for İş
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Is:
 *       type: object
 *       required:
 *         - tarih
 *         - miktar
 *         - birim
 *         - birim_ucret
 *         - calisan_id
 *       properties:
 *         id:
 *           type: integer
 *         tarih:
 *           type: string
 *           format: date
 *         miktar:
 *           type: number
 *         birim:
 *           type: string
 *         birim_ucret:
 *           type: number
 *         toplam_ucret:
 *           type: number
 *         calisan_id:
 *           type: integer
 */

/**
 * @swagger
 * /isler:
 *   get:
 *     summary: İşleri listeleme
 *     security:
 *       - bearerAuth: []
 *     tags: [İşler]
 *     responses:
 *       200:
 *         description: İş listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Is'
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Token geçersiz
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /isler:
 *   post:
 *     summary: Yeni iş ekleme
 *     security:
 *       - bearerAuth: []
 *     tags: [İşler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Is'
 *     responses:
 *       201:
 *         description: Yeni iş başarıyla oluşturuldu
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Token geçersiz
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /isler/{id}:
 *   get:
 *     summary: Belirli bir işi getirme
 *     security:
 *       - bearerAuth: []
 *     tags: [İşler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: İşin ID'si
 *     responses:
 *       200:
 *         description: İş detayları başarıyla getirildi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Token geçersiz
 *       404:
 *         description: İş bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /isler/{id}:
 *   put:
 *     summary: İş güncelleme
 *     security:
 *       - bearerAuth: []
 *     tags: [İşler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek işin ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Is'
 *     responses:
 *       200:
 *         description: İş başarıyla güncellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Token geçersiz
 *       404:
 *         description: İş bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /isler/{id}:
 *   delete:
 *     summary: İş silme
 *     security:
 *       - bearerAuth: []
 *     tags: [İşler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek işin ID'si
 *     responses:
 *       204:
 *         description: İş başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Token geçersiz
 *       404:
 *         description: İş bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', async (req, res) => {
    try {
        const isler = await Is.findAll();
        res.status(200).json(isler);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.post('/', async (req, res) => {
    const { tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id } = req.body;
    try {
        const yeniIs = await Is.create({ tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id });
        res.status(201).json(yeniIs);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

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