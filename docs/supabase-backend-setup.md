# Saloniva Supabase Backend Kurulumu

Bu dosya Saloniva'yi demo/pilot uygulamadan gercek bulut backend'e tasimak icin ilk profesyonel kurulum adimlarini anlatir.

## Neden Supabase?

- Kullanici girisi, veritabani ve dosya saklama tek panelde gelir.
- Row Level Security ile salon verileri birbirinden ayrilir.
- Expo Web, Android ve iOS ile HTTP uzerinden calisir.
- Ileride abonelik, destek sayfasi ve hesap silme akislari ayni backend uzerinden buyutulebilir.

## Kurulum

1. Supabase'de yeni proje olustur.
2. Project Settings > API ekranindan `Project URL` ve `anon public` anahtarini al.
3. Proje kokunde `.env` dosyasi olustur ve `.env.example` icindeki alanlari doldur.
4. Supabase SQL Editor icinde `supabase/schema.sql` dosyasini calistir.
5. Authentication > Providers ekraninda Email girisini aktif et.
6. Canli veriye gecmeden once Table Editor icinde RLS politikalarinin aktif oldugunu kontrol et.

## Ortam Degiskenleri

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
EXPO_PUBLIC_BACKEND_MODE=demo-local
EXPO_PUBLIC_DEMO_SALON_ID=demo-saloniva
```

Baslangicta `EXPO_PUBLIC_BACKEND_MODE=demo-local` kalmali. Boylece mevcut demo bozulmaz.

Gercek bulut testine gecilecekse:

```text
EXPO_PUBLIC_BACKEND_MODE=supabase
```

## Guvenlik Modeli

- Her operasyon tablosunda `salon_id` vardir.
- Kullanici-salon baglantisi `salon_members` tablosunda tutulur.
- RLS politikalari kullanicinin sadece uyesi oldugu salonun verisini okumasina izin verir.
- Odeme verilerini sadece `Salon Sahibi` ve `Yönetici` gorebilir.
- Audit loglar sadece `Salon Sahibi` tarafindan okunur.
- Public randevu linki ileride rate limit ve spam korumasi ile acilmalidir.

## Uygulama Tarafi

Eklenen dosyalar:

- `src/services/supabaseConfig.ts`: guvenli ortam ayarlarini okur.
- `src/services/supabaseRestClient.ts`: Supabase REST isteklerini merkezi hale getirir.
- `src/services/cloudSalonGateway.ts`: Saloniva veri modelini bulut tablolara baglayacak gateway taslagi.
- `supabase/schema.sql`: tablolar, tenant ayrimi ve RLS politikalarinin ilk hali.

## Canliya Gecis Sirasi

1. Supabase projesini ac.
2. SQL semasini calistir.
3. Demo salon ve ilk salon sahibi kullanicisini olustur.
4. Giris ekranini Supabase Auth'a bagla.
5. Once sadece okuma akisini cloud gateway'e bagla.
6. Sonra musteri, randevu, paket ve odeme formlarini tek tek cloud insert/update akislariyla degistir.
7. Audit log, hesap silme ve veri disa aktarma akisini ekle.
8. Abonelik/odeme sistemini bagla.

## Onemli Not

`anon public` anahtari istemci uygulamada kullanilabilir, fakat `service_role` anahtari asla uygulamaya veya GitHub'a konulmaz. Service role sadece guvenli sunucu/edge function tarafinda kullanilir.
