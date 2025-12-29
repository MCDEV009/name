# Backend Deploy Qo'llanmasi

## Variant 1: Railway.app (Tavsiya etiladi)

### 1. Railway'ga Ro'yxatdan O'tish
1. [railway.app](https://railway.app) ga kiring
2. GitHub account bilan ro'yxatdan o'ting
3. "New Project" ni bosing

### 2. MongoDB Database Qo'shish
1. Project ichida "New" → "Database" → "MongoDB" ni tanlang
2. MongoDB yaratilgandan keyin, "Variables" tab'ga o'ting
3. `MONGO_URL` variable'ni ko'rasiz (keyinchalik kerak bo'ladi)

### 3. Backend Service Qo'shish
1. "New" → "GitHub Repo" ni tanlang
2. Repository'ni tanlang va "Deploy" ni bosing
3. **Muhim:** Root Directory ni `backend` ga o'rnating:
   - Settings → Root Directory → `backend`

### 4. Environment Variables Qo'shish
Railway dashboard'da "Variables" tab'ga o'ting va quyidagilarni qo'shing:

```
MONGODB_URI=<MongoDB Variables'dan MONGO_URL'ni copy qiling>
JWT_SECRET=<ixtiyoriy uzun random string, masalan: super_secret_key_123456>
OPENAI_API_KEY=<agar OpenAI ishlatmoqchi bo'lsangiz, OpenAI'dan API key oling>
PORT=5000
```

**Eslatma:** 
- `MONGODB_URI` MongoDB database'dan `MONGO_URL` variable'ni o'z ichiga oladi
- `OPENAI_API_KEY` - agar AI funksiyasi kerak bo'lmasa, o'chirib qoldirishingiz mumkin

### 5. Deploy
1. Railway avtomatik deploy qiladi
2. "Settings" → "Generate Domain" ni bosing
3. Backend URL'ni copy qiling (masalan: `https://your-backend.railway.app`)

### 6. Frontend'ga Qo'shish
Vercel Dashboard'da:
1. Settings → Environment Variables
2. `VITE_API_URL` = `https://your-backend.railway.app` (yoki Railway'dan olgan URL)

---

## Variant 2: Render.com

### 1. Render'ga Ro'yxatdan O'tish
1. [render.com](https://render.com) ga kiring
2. GitHub account bilan ro'yxatdan o'ting

### 2. MongoDB Atlas (Cloud Database)
1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) ga kiring
2. Bepul account yarating
3. "Build a Database" → "Free" ni tanlang
4. Database yaratilgandan keyin:
   - "Connect" → "Connect your application"
   - Connection string'ni copy qiling (keyinchalik kerak)

### 3. Backend Service Yaratish
1. Render Dashboard → "New" → "Web Service"
2. GitHub repository'ni ulang
3. Sozlamalar:
   - **Name:** `milliy-cert-backend` (yoki ixtiyoriy)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### 4. Environment Variables
"Environment" bo'limida quyidagilarni qo'shing:

```
MONGODB_URI=<MongoDB Atlas'dan olgan connection string>
JWT_SECRET=<ixtiyoriy uzun random string>
OPENAI_API_KEY=<OpenAI API key (ixtiyoriy)>
NODE_ENV=production
```

**MongoDB Atlas Connection String format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/milliy_cert_mock?retryWrites=true&w=majority
```

### 5. Deploy
1. "Create Web Service" ni bosing
2. Deploy boshlanadi (5-10 daqiqa davom etadi)
3. URL'ni copy qiling (masalan: `https://milliy-cert-backend.onrender.com`)

### 6. Frontend'ga Qo'shish
Vercel Dashboard'da:
1. Settings → Environment Variables
2. `VITE_API_URL` = Render'dan olgan URL

---

## Test Qilish

Deploy qilingandan keyin, backend'ni test qiling:

```bash
# Browser yoki Postman'da oching:
https://your-backend-url.railway.app/api/health
# yoki
https://your-backend-url.onrender.com/api/health

# Agar "OK" qaytsa, backend ishlamoqda ✅
```

---

## Muammolar va Yechimlar

### MongoDB ulanish xatosi
- MongoDB URI'ni to'g'ri qo'yganingizni tekshiring
- MongoDB Atlas bo'lsa, IP whitelist'ga `0.0.0.0/0` qo'shing (barcha IP'lar uchun)

### Port xatosi
- Railway va Render avtomatik PORT ni beradi
- Kodda `process.env.PORT || 5000` bo'lishi kerak (allaqachon bor ✅)

### CORS xatosi
- Backend'da `cors()` middleware bor (✅)
- Agar muammo bo'lsa, frontend URL'ni allow qiling

### Build xatosi
- Root Directory `backend` ga o'rnatilganini tekshiring
- `package.json` fayli `backend/` papkasida bo'lishi kerak

