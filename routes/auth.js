// TODO Auth routes yapısı değiştirilecek
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Swagger schemas for Auth
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     LoginUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Kullanıcı kaydı oluşturur
 *     tags: [Kimlik Doğrulama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       500:
 *         description: Sunucu hatası.
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Kimlik Doğrulama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Giriş başarılı.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       404:
 *         description: Kullanıcı bulunamadı.
 *       401:
 *         description: Geçersiz şifre.
 *       500:
 *         description: Sunucu hatası.
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz şifre.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Giriş başarılı.', token });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.', error });
    }
});

module.exports = router;