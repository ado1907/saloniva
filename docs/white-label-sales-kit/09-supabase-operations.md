# Supabase Operasyon Modeli

## Amaç

Bu doküman Saloniva'nın Supabase tarafında nasıl yönetileceğini ve proje sahipliği seçeneklerini açıklar.

## İki Kurulum Modeli

### Yönetilen Model

Supabase projesi hizmet sağlayıcı tarafında kalır. Alıcı uygulamayı kullanım lisansı ile kullanır.

Avantajları:

- Teknik bakım daha kontrollüdür.
- Güncelleme ve güvenlik yönetimi tek elde kalır.
- Alıcının teknik yükü azalır.

Dikkat edilecekler:

- Aylık altyapı ücreti sözleşmede net yazılmalıdır.
- Veri dışa aktarım ve sözleşme bitiş senaryosu belirlenmelidir.

### Müşteri Hesabı Modeli

Supabase projesi alıcının hesabına kurulur. Bakım için sınırlı teknik erişim verilir.

Avantajları:

- Alıcı altyapı hesabının doğrudan sahibidir.
- Faturalandırma alıcının kendi hesabından yürür.

Dikkat edilecekler:

- Yanlış ayarlar uygulamayı etkileyebilir.
- Bakım için erişim yetkileri düzenli yönetilmelidir.

## Anahtar Yönetimi

- Publishable/anon key istemci uygulamada kullanılabilir.
- Service role key yalnızca güvenli sunucu ortamında kullanılmalıdır.
- Service role key müşteri sohbetlerinde, README'de, GitHub'da veya uygulama içine konmaz.

## Auth Ayarları

Kontrol edilmesi gerekenler:

- Email provider aktif mi?
- Confirm email canlıda açık mı?
- Site URL doğru mu?
- Redirect URL doğru mu?
- Şifre sıfırlama linki gerçek domainden dönüyor mu?

## Operasyon Kontrol Listesi

- `schema.sql` çalıştı.
- `phase2-auth.sql` çalıştı.
- RLS politikaları aktif.
- İlk salon sahibi hesabı oluşturuldu.
- İkinci salonla veri ayrımı test edildi.
- Randevu, müşteri, ödeme ve paket yazma testi geçti.
- Şifre sıfırlama akışı test edildi.