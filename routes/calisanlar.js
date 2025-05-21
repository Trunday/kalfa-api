const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     Calisan:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         rol:
 *           type: string
 *           enum: [admin, user, manager, kalfa, çalışan]
 *         notlar:
 *           type: string
 *         adres:
 *           type: string
 *         dogum_tarihi:
 *           type: string
 *           format: date
 *         aktif:
 *           type: boolean
 */

/**
 * @swagger
 * /calisanlar:
 *   get:
 *     summary: Tüm çalışanları listele
 *     tags: [Çalışanlar]
 *     security:
 *       - bearerAuth: []
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
 * 
 *   post:
 *     summary: Yeni çalışan ekle
 *     tags: [Çalışanlar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calisan'
 *     responses:
 *       201:
 *         description: Çalışan başarıyla oluşturuldu
 *       500:
 *         description: Sunucu hatası
 * 
 * /calisanlar/{id}:
 *   get:
 *     summary: Belirli bir çalışanı getir
 *     tags: [Çalışanlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Çalışan başarıyla getirildi
 *       404:
 *         description: Çalışan bulunamadı
 *       500:
 *         description: Sunucu hatası
 * 
 *   put:
 *     summary: Çalışan bilgilerini güncelle
 *     tags: [Çalışanlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calisan'
 *     responses:
 *       200:
 *         description: Çalışan başarıyla güncellendi
 *       404:
 *         description: Çalışan bulunamadı
 *       500:
 *         description: Sunucu hatası
 * 
 *   delete:
 *     summary: Çalışanı pasif duruma getir
 *     tags: [Çalışanlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Çalışan başarıyla pasif duruma getirildi
 *       404:
 *         description: Çalışan bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

router.get('/', async (req, res) => {
    try {
        const calisanlar = await User.findAll({
            where: { rol: 'çalışan' },
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(calisanlar);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.post('/', async (req, res) => {
    const { username, email, notlar, adres, dogum_tarihi } = req.body;
    try {
        const yeniCalisan = await User.create({
            username,
            email,
            rol: 'çalışan',
            notlar,
            adres,
            dogum_tarihi,
            aktif: true
        });
        const { password, ...calisanBilgileri } = yeniCalisan.toJSON();
        res.status(201).json(calisanBilgileri);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const calisan = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (calisan && calisan.rol === 'çalışan') {
            res.status(200).json(calisan);
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.put('/:id', async (req, res) => {
    const { username, email, notlar, adres, dogum_tarihi, aktif } = req.body;
    try {
        const calisan = await User.findByPk(req.params.id);
        if (calisan && calisan.rol === 'çalışan') {
            await calisan.update({
                username,
                email,
                notlar,
                adres,
                dogum_tarihi,
                aktif
            });
            const { password, ...calisanBilgileri } = calisan.toJSON();
            res.status(200).json(calisanBilgileri);
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const calisan = await User.findByPk(req.params.id);
        if (calisan && calisan.rol === 'çalışan') {
            await calisan.update({ aktif: false });
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

module.exports = router;