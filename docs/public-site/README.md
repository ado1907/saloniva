# Saloniva Public Site Pages

Bu klasor App Store / Google Play ve Supabase redirect icin gerekli statik sayfalari icerir.

Yayinlanacak yollar:

- `privacy.html` -> `https://saloniva.app/gizlilik`
- `support.html` -> `https://saloniva.app/destek`
- `delete-account.html` -> `https://saloniva.app/hesap-silme`
- `auth-callback.html` -> `https://saloniva.app/auth/callback`

Supabase ayari:

- Authentication > URL Configuration > Site URL: `https://saloniva.app`
- Redirect URLs: `https://saloniva.app/auth/callback`
- `.env`: `EXPO_PUBLIC_AUTH_REDIRECT_URL=https://saloniva.app/auth/callback`

Bu dosyalar Netlify, Vercel, GitHub Pages veya klasik hosting uzerinden yayinlanabilir.
