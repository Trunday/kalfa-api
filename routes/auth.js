const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - rol
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *           format: email
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
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             rol:
 *               type: string
 */

router.post('/register', async (req, res) => {
    const { 
        username, 
        password, 
        email, 
        rol, 
        notlar, 
        adres, 
        dogum_tarihi 
    } = req.body;

    try {
        // Kullanıcı adı veya email kontrolü
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Bu kullanıcı adı veya email zaten kullanımda.' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            rol: rol || 'user', // Varsayılan rol
            notlar,
            adres,
            dogum_tarihi,
            aktif: true
        });

        // Hassas bilgileri çıkar
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, rol: newUser.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu.',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Kullanıcı oluşturulurken hata oluştu.', 
            error: error.message 
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ 
            where: { 
                [Sequelize.Op.or]: [
                    { username: username },
                    { email: username } // Email ile de giriş yapılabilir
                ],
                aktif: true // Sadece aktif kullanıcılar giriş yapabilir
            } 
        });

        if (!user) {
            return res.status(404).json({ 
                message: 'Kullanıcı bulunamadı veya hesap aktif değil.' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Geçersiz şifre.' 
            });
        }

        // Hassas bilgileri çıkar
        const { password: _, ...userWithoutPassword } = user.toJSON();

        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                rol: user.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: 'Giriş başarılı.',
            user: userWithoutPassword,
            token 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Giriş yapılırken hata oluştu.', 
            error: error.message 
        });
    }
});

// Şifre sıfırlama endpoint'i
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email, aktif: true } });
        if (!user) {
            return res.status(404).json({ 
                message: 'Bu email adresi ile kayıtlı aktif kullanıcı bulunamadı.' 
            });
        }

        // TODO: Şifre sıfırlama mantığı implement edilecek
        // 1. Benzersiz token oluştur
        // 2. Email gönder
        // 3. Geçici token kaydet

        res.status(200).json({ 
            message: 'Şifre sıfırlama talimatları email adresinize gönderildi.' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Şifre sıfırlama işlemi başlatılırken hata oluştu.', 
            error: error.message 
        });
    }
});

// Profil bilgilerini getirme endpoint'i
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Profil bilgileri alınırken hata oluştu.', 
            error: error.message 
        });
    }
});

module.exports = router;