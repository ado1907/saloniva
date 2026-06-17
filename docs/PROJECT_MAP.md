# Saloniva Proje Haritası

Bu dosya projede hangi klasörün ne işe yaradığını hızlıca görmek için hazırlanmıştır.

## En Çok Kullanılacak Dosyalar

| İhtiyaç | Dosya / Klasör |
|---|---|
| Uygulamayı başlatmak | `README.md` |
| Web/Android/iOS kodu | `src/` |
| Supabase veritabanı kurulumu | `supabase/` |
| Satış hedef listesi | `docs/sales-prospect-list.md` |
| White-label satış paketi | `docs/white-label-sales-kit/` |
| Güvenlik taraması | `docs/security-review.md` |
| Canlı ürün planı | `docs/production-launch-plan.md` |
| GitHub yükleme notu | `docs/GITHUB_UPLOAD.md` |

## Kök Dosyalar

- `.env`: Yerel Supabase ayarları. GitHub'a gönderilmez.
- `.env.example`: Örnek ortam ayarları. GitHub'a gönderilebilir.
- `App.tsx`: Uygulamanın ana giriş dosyası.
- `README.md`: Projeyi çalıştırma ve genel tanıtım.
- `PROJECT_MAP.md`: Bu proje haritası.
- `package.json`: Komutlar ve bağımlılıklar.

## Uygulama Kodu

`src/` klasörü gerçek uygulama kodudur.

- `src/screens/`: Uygulamadaki ana ekranlar.
- `src/components/`: Tekrar kullanılan kart, buton, modal ve form bileşenleri.
- `src/navigation/`: Sol menü ve mobil alt menü.
- `src/state/`: Uygulama içi veri yönetimi.
- `src/services/`: Backend, Supabase, auth ve abonelik servisleri.
- `src/theme/`: Renk, yazı ve ölçü sistemi.
- `src/config/`: Ürün, görsel, satış ve lansman ayarları.
- `src/security/`: Rol ve yetki modeli.
- `src/qa/`: Test senaryoları.

## Backend ve Supabase

`supabase/` klasörü bulut backend kurulumu içindir.

- `supabase/schema.sql`: Ana tablolar ve RLS güvenlik kuralları.
- `supabase/phase2-auth.sql`: Gerçek kullanıcı ve salon hesabı oluşturma fonksiyonları.

Kurulum rehberi:

- `docs/supabase-backend-setup.md`

## Satış Dosyaları

Satışla ilgili dosyalar `docs/` altındadır.

- `docs/sales-prospect-list.md`: İlk hedef müşteri listesi.
- `docs/pilot-sales-kit.md`: Pilot satış görüşmesi paketi.
- `docs/white-label-sales-kit/`: White-label satış paketi.

White-label klasörü içinde:

- `01-demo-video-script.md`: 1 dakikalık demo video metni.
- `02-pdf-sales-one-pager.md`: PDF satış dosyası metni.
- `03-price-quote-template.md`: Fiyat teklif şablonu.
- `04-white-label-delivery-package.md`: Teslim paketi.
- `05-license-not-source-code.md`: Kaynak kod devri yok açıklaması.

## Plan ve Kontrol Dosyaları

- `docs/product-roadmap.md`: Ürün yol haritası.
- `docs/production-launch-plan.md`: Canlı ürün planı.
- `docs/store-readiness.md`: App Store / Google Play hazırlığı.
- `docs/security-review.md`: Güvenlik taraması.
- `docs/agent-workflow.md`: Ajan çalışma düzeni.
- `docs/agent-run-latest.md`: Son ajan çalışması notları.

## Şimdilik Dokunulmaması Gerekenler

- `node_modules/`: Kurulan paketler, GitHub'a gitmez.
- `.expo/`: Expo geçici dosyaları, GitHub'a gitmez.
- `.env`: Yerel anahtarlar, GitHub'a gitmez.
- `package-lock.json`: Paket kilidi, genelde elle düzenlenmez.

## En Sağlıklı Çalışma Sırası

1. Önce uygulama kodu gerekiyorsa `src/` içinde çalış.
2. Backend gerekiyorsa `supabase/` ve `src/services/` dosyalarına bak.
3. Satış materyali gerekiyorsa `docs/white-label-sales-kit/` içinde çalış.
4. Hedef müşteri ve demo gönderimi için `docs/sales-prospect-list.md` kullan.
5. Her büyük değişiklikten sonra `npm run typecheck` çalıştır.