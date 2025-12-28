# Frontend - Milliy Cert Mock

## O'rnatish

```bash
npm install
```

## Ishga Tushirish

```bash
npm run dev
```

Ilova `http://localhost:3000` da ochiladi.

## Build

Production build uchun:

```bash
npm run build
```

Build fayllar `dist/` papkasida bo'ladi.

## Vercel'ga Deploy Qilish

### 1. Vercel'ga ulash

Vercel dashboard'da yoki CLI orqali:

```bash
npm i -g vercel
vercel
```

### 2. Environment Variables

Vercel dashboard'da yoki `vercel.json` orqali quyidagi environment variable'ni qo'shing:

- **VITE_API_URL**: Backend API URL (masalan: `https://your-backend.railway.app` yoki `https://your-backend.render.com`)

**Muhim:** Backend alohida deploy qilingan bo'lishi kerak (Railway, Render, Heroku, yoki boshqa platforma).

### 3. Deploy

GitHub repository'ni Vercel'ga ulang yoki `vercel --prod` buyrug'ini ishlating.

### 4. Custom Domain Qo'shish (masalan: mockexam.ms)

Agar custom domain ishlatmoqchi bo'lsangiz:

1. **Vercel Dashboard'da:**
   - Project → Settings → Domains
   - `mockexam.ms` va `www.mockexam.ms` ni qo'shing

2. **DNS Sozlamalari:**
   Domen provayderingizda (Cloudflare, Namecheap, GoDaddy, va hokazo) quyidagi DNS yozuvlarini qo'shing:
   
   - **Root domain (`mockexam.ms`):**
     - Type: `A` yoki `CNAME`
     - Name: `@`
     - Value: Vercel ko'rsatgan qiymat (odatda `76.76.21.21` yoki `cname.vercel-dns.com`)
   
   - **WWW subdomain (`www.mockexam.ms`):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

3. **Kutish:**
   - DNS propagatsiya 5 minutdan 24 soatgacha davom etishi mumkin
   - Vercel dashboard'da domain holati "Valid Configuration" ko'rsatilguncha kutamiz

**Eslatma:**
- Avval Vercel'ning bepul URL'ini (`your-project.vercel.app`) tekshiring
- Keyin custom domain qo'shing
- Agar DNS xatosi bo'lsa, domen provayderingizda DNS yozuvlarini tekshiring

### Eslatma

- Frontend Vercel'da deploy qilinadi
- Backend alohida platformada deploy qilinishi kerak (masalan: Railway, Render)
- `VITE_API_URL` environment variable'da backend URL'ni to'g'ri ko'rsating