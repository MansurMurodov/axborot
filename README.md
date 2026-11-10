# RTR — Axborot texnologiyalari asoslari (Next.js + TypeScript + Prisma)
Python/Django/Flask/Streamlit ishlatilmagan.

## Ishga tushirish
1. `cp .env.example .env` va PostgreSQL ma'lumotlarini kiriting
2. `npm install`
3. `npx prisma db push`
4. `npm run seed` — 3 rol, 30 mashg'ulot (12 nazariy + 18 amaliy), testlar, glossariy
5. `npm run gen:pptx` — `presentations/` ichida 30 ta PPTX
6. PDF: `soffice --headless --convert-to pdf --outdir pdf presentations/*.pptx` (LibreOffice)
7. `npm run dev` → http://localhost:3000

Demo: admin@rtr.uz / teacher@rtr.uz / student@rtr.uz — parol `Admin123!` (o'zgartiring!)

## Tayyor qismlar
Prisma sxema (16 jadval), seed, PptxGenJS generatori, Auth.js (rollar), middleware, xavfsiz fayl yuklash, test tekshirish API.

## Keyingi qadamlar
UI sahifalari (dashboard, kabinetlar, Recharts, PDF.js, Excel eksport), ma'ruza matnlarini boyitish, video/audio.
Universal bo'lishi uchun `Course` jadvali orqali boshqa fanlar qo'shiladi.
