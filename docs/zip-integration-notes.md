# ZIP Entegrasyon Notları

Bu entegrasyon üç indirilen ZIP paketini Saloniva'ya güvenli şekilde uyarlamak için yapıldı.

## Kullanılan yaklaşım

- `react-native-skia-main.zip`: Tam native grafik motoru monorepo'su olduğu için doğrudan projeye eklenmedi. Expo SDK 52 ve cihaz build sürecini riske atmamak için Skia fikri, React Native `View` tabanlı sinyal haritası olarak yeniden tasarlandı.
- `ui-main.zip`: shadcn/ui web ve Tailwind odaklı olduğu için dosyaları kopyalanmadı. Kart, aksiyon, rozet, yoğun ama ferah iş ekranı prensipleri Saloniva'nın mevcut tema sistemiyle yeniden üretildi.
- `ai-main.zip`: AI SDK sunucu/web odaklı olduğu ve anahtar gerektirebileceği için doğrudan bağımlılık yapılmadı. Satış demosu için yerel, deterministik “Saloniva AI Demo” karar paneli eklendi.

## Eklenen ürün değeri

- Dashboard artık tahsilat, online talep, paket yenileme ve stok riskini tek yerde akıllı öneri gibi gösterir.
- Demo ekranı alıcıya “bu uygulama salon sahibinin bugün ne yapacağını söyler” mesajını daha hızlı verir.
- Gerçek AI veya Skia entegrasyonu için altyapı fikri hazırdır, fakat mevcut sürüm web/Android/iOS uyumluluğunu korur.

## Sonraki güvenli adım

Gerçek AI eklenecekse önce backend tarafında güvenli bir edge function/API kurulmalı; istemciye gizli anahtar konmamalıdır. Gerçek Skia eklenecekse Expo SDK uyumluluğu ve development build süreci ayrı test edilmelidir.