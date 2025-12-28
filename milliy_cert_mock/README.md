# Milliy Cert Mock

Milliy Cert Mock - Mock Test Platformasi

Uzbekistan DTM "Milliy sertifikat" imtihonlariga tayyorgarlik ko'rish uchun to'liq funksionallikli web-ilova.

Uzbekistan DTM "Milliy sertifikat" imtihonlariga tayyorgarlik ko'rish uchun to'liq funksionallikli web-ilova.

## Texnologiyalar

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt password hashing
- OpenAI API (AI savol yaratish)

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios

## Funksiyalar

- ✅ JWT asosida autentifikatsiya (ro'yxatdan o'tish va kirish)
- ✅ AI yordamida 4 tilda savol yaratish (Qoraqalpoq, O'zbek, Rus, Ingliz)
- ✅ Mock test yechish va natijalarni kuzatish
- ✅ Bepul kvota: har bir foydalanuvchi uchun 20 ta savol
- ✅ To'lov tizimi (Payme/Click integratsiyasi uchun asos)
- ✅ Savollarni baholash va shikoyat qilish
- ✅ Moderatsiya paneli (tasdiqlash/deaktivlashtirish)
- ✅ Test tarixi va statistika

## O'rnatish va Ishga Tushirish

### Talablar
- Node.js (v16 yoki yuqori)
- MongoDB (lokal yoki cloud)
- OpenAI API kaliti (AI savol yaratish uchun)

### Backend O'rnatish

```bash
cd backend
npm install
```

`.env` fayl yarating:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/milliy_cert_mock
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
OPENAI_API_KEY=your_openai_api_key_here
```

Backendni ishga tushiring:
```bash
npm start
# yoki development uchun
npm run dev
```

### Frontend O'rnatish

```bash
cd frontend
npm install
```

Frontendni ishga tushiring:
```bash
npm run dev
```

Brauzerda oching: http://localhost:3000

## API Endpoints

### Autentifikatsiya
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Joriy foydalanuvchi ma'lumotlari

### Savollar
- `GET /api/questions` - Barcha tasdiqlangan savollar
- `GET /api/questions/:id` - Savol ma'lumotlari
- `POST /api/questions` - Yangi savol yaratish (qo'lda)
- `POST /api/questions/:id/rate` - Savolni baholash (1-5)
- `POST /api/questions/:id/report` - Savolga shikoyat qilish

### AI Savol Yaratish
- `POST /api/ai/generate-question` - AI yordamida savol yaratish
  - Body: `{ language, subject, topic, difficulty }`

### Testlar
- `POST /api/tests/start` - Testni boshlash
- `POST /api/tests/:id/submit` - Testni yakunlash
- `GET /api/tests/history` - Test tarixi
- `GET /api/tests/:id` - Test ma'lumotlari

### Moderatsiya (faqat moderator/admin)
- `GET /api/moderation/pending` - Kutilayotgan savollar
- `GET /api/moderation/reported` - Shikoyat qilingan savollar
- `POST /api/moderation/approve/:id` - Savolni tasdiqlash
- `POST /api/moderation/deactivate/:id` - Savolni deaktivlashtirish
- `GET /api/moderation/stats` - Moderatsiya statistikasi

### To'lovlar
- `GET /api/payments/packages` - To'lov paketlari
- `POST /api/payments/init` - To'lov yaratish
- `POST /api/payments/verify` - To'lovni tasdiqlash
- `POST /api/payments/add-quota` - Kvota qo'shish (test/admin)

## Ball Hisoblash Formula

```
Score = (To'g'ri javoblar / Jami savollar) * 100
```

Ball 100 ball tizimida hisoblanadi va yaxlitlanadi.

## Kvota Tizimi

- Har bir yangi foydalanuvchi 20 ta bepul savol olish huquqiga ega
- Qo'shimcha kvota to'lov orqali olinadi
- Paketlar:
  - **Asosiy**: 50 savol - 50,000 so'm
  - **Premium**: 150 savol - 120,000 so'm
  - **Cheksiz**: 1000 savol - 300,000 so'm

## AI Savol Yaratish

AI savol yaratish uchun OpenAI API kaliti kerak. Prompt quyidagicha tuzilgan:

```
Foydalanuvchi belgilagan tilda savol yarat:
Til: {language}
Fan: {subject}
Mavzu: {topic}
Qiyinchilik: {difficulty}

Output JSON formatda:
- questionText
- options (A, B, C, D)
- correctAnswer
```

## Rollar

- **user**: Oddiy foydalanuvchi (default)
- **moderator**: Moderatsiya huquqlari
- **admin**: To'liq huquqlar

Moderator rolini MongoDB'da qo'lda o'rnatish kerak:
```javascript
db.users.updateOne(
  { email: "moderator@example.com" },
  { $set: { role: "moderator" } }
)
```

## To'lov Integratsiyasi

Hozirgi vaqtda mock to'lov tizimi mavjud. Haqiqiy ishlatish uchun:

1. Payme yoki Click API integratsiyasini qo'shing
2. `/api/payments/init` endpoint'ida to'lov URL'ini qaytaring
3. `/api/payments/verify` endpoint'ida webhook'ni qayta ishlang
4. To'lov muvaffaqiyatli bo'lganda foydalanuvchi kvotasini yangilang

## Litsenziya

MIT

## Muallif

Milliy Cert Mock Platform
