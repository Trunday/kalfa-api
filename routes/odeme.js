const express = require("express");
const router = express.Router();
const Odeme = require("../models/odeme");
const authenticateToken = require("../middleware/auth");

router.use(authenticateToken, express.json());

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

/**
 * @swagger
 * /odeme:
 *   get:
 *     summary: Tüm ödemeleri listele
 *     tags: [Ödemeler]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Odeme'
 *       500:
 *         description: Sunucu hatası
 *
 *   post:
 *     summary: Yeni ödeme ekle
 *     tags: [Ödemeler]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Odeme'
 *     responses:
 *       201:
 *         description: Ödeme başarıyla oluşturuldu
 *       500:
 *         description: Sunucu hatası
 *
 * /odeme/{id}:
 *   get:
 *     summary: Belirli bir ödemeyi getir
 *     tags: [Ödemeler]
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
 *         description: Ödeme başarıyla getirildi
 *       404:
 *         description: Ödeme bulunamadı
 *       500:
 *         description: Sunucu hatası
 *
 *   put:
 *     summary: Ödeme bilgilerini güncelle
 *     tags: [Ödemeler]
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
 *             $ref: '#/components/schemas/Odeme'
 *     responses:
 *       200:
 *         description: Ödeme başarıyla güncellendi
 *       404:
 *         description: Ödeme bulunamadı
 *       500:
 *         description: Sunucu hatası
 *
 *   delete:
 *     summary: Ödeme kaydını sil
 *     tags: [Ödemeler]
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
 *         description: Ödeme başarıyla silindi
 *       404:
 *         description: Ödeme bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

router.get("/", async (req, res) => {
  try {
    const odemeler = await Odeme.findAll({
      include: ["User"],
      //TODO Burada user_id'yi kontrol etmemiz gerekiyor. Şu an tüm ödemeleri getiriyor
      //TODO Mantık hataları var galiba burada biraz daha durmam gerekecek gibi
    });
    // Kullanıcı şifrelerini manuel olarak kaldır
    const temizVeri = odemeler.map((odeme) => {
      const odemeJSON = odeme.toJSON();
      if (odemeJSON.User) {
        delete odemeJSON.User.password;
      }
      return odemeJSON;
    });

    res.status(200).json(temizVeri);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error });
  }
});

router.post("/", async (req, res) => {
  const { tarih, miktar, aciklama, odeme_turu, odeme_tipi, user_id } = req.body;
  try {
    const yeniOdeme = await Odeme.create({
      tarih,
      miktar,
      aciklama,
      odeme_turu,
      odeme_tipi,
      user_id,
    });
    res.status(201).json(yeniOdeme);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const odeme = await Odeme.findByPk(req.params.id, {
      include: ["User"],
    });
    if (odeme) {
      res.status(200).json(odeme);
    } else {
      res.status(404).json({ message: "Ödeme bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error });
  }
});

router.put("/:id", async (req, res) => {
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
        user_id,
      });
      res.status(200).json(odeme);
    } else {
      res.status(404).json({ message: "Ödeme bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const sonuc = await Odeme.destroy({ where: { id: req.params.id } });
    if (sonuc) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Ödeme bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası.", error });
  }
});

module.exports = router;
