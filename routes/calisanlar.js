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