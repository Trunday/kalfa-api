# Kalfa API Dokümantasyonu

## Genel Bilgiler

- Taban URL: `http://localhost:3000/`
- Tüm istekler JSON formatında yapılmalıdır.
- Bazı uç noktalar için JWT ile kimlik doğrulama gereklidir (Authorization header: `Bearer <token>`).

---

## Kimlik Doğrulama

### Kayıt Ol

- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "username": "kullaniciadi",
    "password": "sifre"
  }
  ```
- **Yanıt:**
  ```json
  {
    "message": "Kullanıcı başarıyla oluşturuldu.",
    "user": { ... }
  }
  ```

### Giriş Yap

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "username": "kullaniciadi",
    "password": "sifre"
  }
  ```
- **Yanıt:**
  ```json
  {
    "message": "Giriş başarılı.",
    "token": "<JWT_TOKEN>"
  }
  ```

---

## Çalışanlar

### Listele (JWT Gerekli)

- **GET** `/calisanlar`
- **Header:** `Authorization: Bearer <token>`
- **Yanıt:** `[ { "id": 1, "ad": "...", "soyad": "...", "telefon": "..." }, ... ]`

### Ekle

- **POST** `/calisanlar`
- **Body:**
  ```json
  {
    "ad": "Ali",
    "soyad": "Veli",
    "telefon": "5551234567"
  }
  ```

### Detay

- **GET** `/calisanlar/:id`

### Güncelle

- **PUT** `/calisanlar/:id`
- **Body:** (ad, soyad, telefon)

### Sil

- **DELETE** `/calisanlar/:id`

---

## İşler

### Listele

- **GET** `/isler`

### Ekle

- **POST** `/isler`
- **Body:**
  ```json
  {
    "tarih": "2024-05-17",
    "miktar": 10,
    "birim": "saat",
    "birim_ucret": 100,
    "toplam_ucret": 1000,
    "calisan_id": 1
  }
  ```

### Detay

- **GET** `/isler/:id`

### Güncelle

- **PUT** `/isler/:id`
- **Body:** (tarih, miktar, birim, birim_ucret, toplam_ucret, calisan_id)

### Sil

- **DELETE** `/isler/:id`

---

## Avanslar

### Listele

- **GET** `/avanslar`

### Ekle

- **POST** `/avanslar`
- **Body:**
  ```json
  {
    "tarih": "2024-05-17",
    "miktar": 500,
    "calisan_id": 1
  }
  ```

### Detay

- **GET** `/avanslar/:id`

### Güncelle

- **PUT** `/avanslar/:id`
- **Body:** (tarih, miktar, calisan_id)

### Sil

- **DELETE** `/avanslar/:id`

---

## Ödemeler

### Listele

- **GET** `/odeme`

### Ekle

- **POST** `/odeme`
- **Body:**
  ```json
  {
    "tarih": "2024-05-17",
    "miktar": 1000,
    "calisan_id": 1
  }
  ```

### Detay

- **GET** `/odeme/:id`

### Güncelle

- **PUT** `/odeme/:id`
- **Body:** (tarih, miktar, calisan_id)

### Sil

- **DELETE** `/odeme/:id`

---

## Notlar

- Hatalı isteklerde yanıtlar genellikle `{ "message": "...", "error": ... }` şeklindedir.
- JWT gerektiren uç noktalar için giriş yaptıktan sonra dönen token'ı kullanmalısınız.
- Tüm tarih alanları ISO 8601 formatında olmalıdır (örn: `"2024-05-17"`).

---

Daha fazla detay veya örnek istekler için endpoint kodlarına bakabilirsiniz.